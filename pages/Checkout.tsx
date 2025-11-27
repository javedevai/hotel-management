import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { NeonCard, NeonButton, NeonInput, NeonBadge } from '../components/UI';
import { useAuth } from '../services/authContext';
import { dataService } from '../services/dataService';
import { RoomType } from '../types';
import { Loader, Calendar, CreditCard } from 'lucide-react';

export const Checkout: React.FC = () => {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
    const checkOut = searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const [room, setRoom] = useState<RoomType | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (roomId) {
            dataService.getRoomTypeById(roomId).then(r => setRoom(r || null));
        }
    }, [roomId]);

    if (!room) return <div className="text-center py-20">Loading Booking Details...</div>;

    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const total = room.base_price * nights;
    const tax = total * 0.15;
    const grandTotal = total + tax;

    const handleConfirm = async () => {
        if (!user) {
            alert("Please sign in to complete your booking.");
            return;
        }

        setProcessing(true);
        const result = await dataService.createBooking({
            user_id: user.id,
            room_type_id: room.id,
            check_in: checkIn,
            check_out: checkOut,
            total: grandTotal
        });

        setProcessing(false);
        if (result) {
            navigate('/my-bookings');
        } else {
            alert("Booking failed. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-white">Confirm Your Stay</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="space-y-6">
                    <NeonCard className="p-0 overflow-hidden">
                        <img src={room.image_url} alt={room.name} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">{room.name}</h2>
                            <div className="flex gap-2 mb-4">
                                {room.amenities.slice(0, 3).map(a => <NeonBadge key={a}>{a}</NeonBadge>)}
                            </div>
                            
                            <div className="space-y-3 text-slate-300">
                                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-cyan-400"/>
                                        <span className="text-sm">Check-in</span>
                                    </div>
                                    <span className="font-bold">{checkIn}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-cyan-400"/>
                                        <span className="text-sm">Check-out</span>
                                    </div>
                                    <span className="font-bold">{checkOut}</span>
                                </div>
                            </div>
                        </div>
                    </NeonCard>
                </div>

                {/* Payment Section */}
                <div className="space-y-6">
                    <NeonCard className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CreditCard className="text-purple-400" /> Payment Details
                        </h3>
                        
                        <div className="space-y-4 mb-6">
                             <div className="flex justify-between">
                                 <span>{nights} Nights x ${room.base_price}</span>
                                 <span>${total.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-slate-400 text-sm">
                                 <span>Taxes & Fees (15%)</span>
                                 <span>${tax.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between font-bold text-xl text-cyan-400 border-t border-slate-700 pt-4">
                                 <span>Total</span>
                                 <span>${grandTotal.toFixed(2)}</span>
                             </div>
                        </div>

                        <div className="space-y-4">
                            <NeonInput label="Cardholder Name" placeholder="As on card" />
                            <NeonInput label="Card Number" placeholder="0000 0000 0000 0000" />
                            <div className="flex gap-4">
                                <NeonInput label="Expiry" placeholder="MM/YY" className="w-full" />
                                <NeonInput label="CVC" placeholder="123" className="w-full" />
                            </div>
                        </div>

                        <NeonButton className="w-full mt-8 h-12 text-lg" onClick={handleConfirm} disabled={processing}>
                            {processing ? <Loader className="animate-spin mx-auto"/> : `Pay $${grandTotal.toFixed(2)}`}
                        </NeonButton>
                        <p className="text-xs text-center text-slate-500 mt-4">
                            Secure payment processed by Stripe. No real money will be charged (Demo).
                        </p>
                    </NeonCard>
                </div>
            </div>
        </div>
    );
};
