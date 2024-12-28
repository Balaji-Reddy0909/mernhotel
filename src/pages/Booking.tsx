import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

interface Room {
  id: string;
  name: string;
  rate_per_night: number;
  max_occupancy: number;
}

export default function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [persons, setPersons] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();
      
      if (error) {
        console.error('Error fetching room:', error);
        return;
      }

      setRoom(data);
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    if (room && checkIn && checkOut) {
      const days = differenceInDays(new Date(checkOut), new Date(checkIn));
      setTotalPrice(days * room.rate_per_night);
    }
  }, [room, checkIn, checkOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            room_id: room.id,
            user_id: user.id, // Add the user_id here
            check_in_date: checkIn,
            check_out_date: checkOut,
            num_persons: persons,
            total_price: totalPrice,
          },
        ]);

      if (error) throw error;

      toast.success('Room booked successfully!');
      navigate('/rooms');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!room) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Book {room.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
          <input
            type="date"
            required
            min={checkIn}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Persons</label>
          <input
            type="number"
            required
            min={1}
            max={room.max_occupancy}
            value={persons}
            onChange={(e) => setPersons(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {totalPrice > 0 && (
          <div className="text-lg font-semibold">
            Total Price: ₹{totalPrice}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Book
        </button>
      </form>
    </div>
  );
}