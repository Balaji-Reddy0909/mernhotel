/*
  # Initial Schema for Hotel Booking System

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `rate_per_night` (integer, in INR)
      - `max_occupancy` (integer)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `room_id` (uuid, references rooms)
      - `check_in_date` (date)
      - `check_out_date` (date)
      - `num_persons` (integer)
      - `total_price` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create rooms table
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  rate_per_night integer NOT NULL,
  max_occupancy integer NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  room_id uuid REFERENCES rooms NOT NULL,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  num_persons integer NOT NULL,
  total_price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for rooms
CREATE POLICY "Anyone can view rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample rooms
INSERT INTO rooms (name, description, rate_per_night, max_occupancy, image_url) VALUES
('Deluxe Room', 'Spacious room with city view', 5000, 2, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1000'),
('Premium Suite', 'Luxury suite with separate living area', 8000, 3, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000'),
('Family Room', 'Perfect for families with children', 10000, 4, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000');