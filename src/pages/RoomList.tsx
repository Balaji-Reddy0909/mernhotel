import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { IndianRupee } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  description: string;
  rate_per_night: number;
  max_occupancy: number;
  image_url: string;
}

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*');
      
      if (error) {
        console.error('Error fetching rooms:', error);
        return;
      }

      setRooms(data || []);
    };

    fetchRooms();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={room.image_url}
            alt={room.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
            <p className="mt-2 text-gray-600">{room.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-gray-900">
                <IndianRupee size={20} className="mr-1" />
                <span className="text-lg font-semibold">{room.rate_per_night}</span>
                <span className="text-sm text-gray-600">/night</span>
              </div>
              <div className="text-sm text-gray-600">
                Max occupancy: {room.max_occupancy}
              </div>
            </div>
            <button
              onClick={() => navigate(`/booking/${room.id}`)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}