import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { IndianRupee } from 'lucide-react';

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  num_persons: number;
  total_price: number;
  rooms: {
    name: string;
    rate_per_night: number;
  };
}

export default function Account() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms (
            name,
            rate_per_night
          )
        `)
        .eq('user_id', user?.id)
        .order('check_in_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      setBookings(data || []);
    };

    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Bookings</h2>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{booking.rooms.name}</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-medium">{format(new Date(booking.check_in_date), 'PP')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-medium">{format(new Date(booking.check_out_date), 'PP')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-medium">{booking.num_persons}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Price</p>
                <p className="font-medium flex items-center">
                  <IndianRupee size={16} className="mr-1" />
                  {booking.total_price}
                </p>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-gray-600">You haven't made any bookings yet.</p>
        )}
      </div>
    </div>
  );
}