import React, { useEffect, useState } from 'react';
import { NeonCard, NeonBadge } from '../components/UI';
import { useAuth } from '../services/authContext';
import { dataService } from '../services/dataService';
import { Booking, BookingStatus } from '../types';
import { Calendar, MapPin, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyBookings: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            dataService.getUserBookings(user.id).then(data => {
                setBookings(data);
                setLoading(false);
            });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
                <p className="text-slate-400 mb-6">You need to be logged in to view your bookings.</p>
            </div>
        );
    }

    if (loading) return <div className="text-center py-20 text-cyan-400 animate-pulse">Loading trips...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-white">My Trips</h1>
            
            {bookings.length === 0 ? (
                <NeonCard className="p-12 text-center opacity-75">
                    <div className="mb-4 text-6xl">🧳</div>
                    <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
                    <p className="text-slate-400 mb-6">Ready to plan your next escape to Quetta?</p>
                    <Link to="/" className="text-cyan-400 hover:underline">Browse Rooms</Link>
                </NeonCard>
            ) : (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <NeonCard key={booking.id} className="flex flex-col md:flex-row overflow-hidden group border-l-4 border-l-cyan-500">
                             <div className="w-full md:w-48 h-32 md:h-auto bg-slate-800 relative">
                                <img src={booking.image_url || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000'} alt="Room" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                             </div>
                             <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white">{booking.room_type_name}</h3>
                                    <NeonBadge color={booking.status === BookingStatus.CONFIRMED ? 'green' : 'amber'}>
                                        {booking.status}
                                    </NeonBadge>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} className="text-cyan-400"/>
                                        <span>{booking.check_in} — {booking.check_out}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} className="text-cyan-400"/>
                                        <span>Quetta A1 Hotel</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-slate-800 pt-3 mt-auto">
                                    <span className="text-xs text-slate-500">Booking ID: {booking.id.slice(0,8)}</span>
                                    <span className="font-bold text-white">${booking.total_amount}</span>
                                </div>
                             </div>
                        </NeonCard>
                    ))}
                </div>
            )}
        </div>
    );
};
