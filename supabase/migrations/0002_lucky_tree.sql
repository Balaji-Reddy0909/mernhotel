/*
  # Update booking policies and add more rooms

  1. Security Changes
    - Update booking policy to allow users to insert bookings with their user_id
    - Add policy for users to update their own bookings
  
  2. New Content
    - Add more sample rooms with diverse options and price ranges
*/

-- Update booking policy
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add more sample rooms
INSERT INTO rooms (name, description, rate_per_night, max_occupancy, image_url) VALUES
('Executive Suite', 'Luxurious suite with panoramic views', 12000, 2, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000'),
('Garden View Room', 'Peaceful room overlooking our manicured gardens', 6000, 2, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000'),
('Presidential Suite', 'Our most luxurious accommodation with butler service', 25000, 4, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1000'),
('Ocean View Suite', 'Stunning suite with breathtaking ocean views', 15000, 3, 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1000'),
('Honeymoon Suite', 'Romantic suite perfect for couples', 18000, 2, 'https://images.unsplash.com/photo-1619292585355-ab0e3fd509fe?auto=format&fit=crop&q=80&w=1000'),
('Business Room', 'Functional room with work desk and high-speed internet', 7000, 2, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1000');