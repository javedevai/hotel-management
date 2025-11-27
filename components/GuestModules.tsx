import React, { useState, useEffect } from 'react';
import { NeonCard, NeonButton, NeonInput, NeonBadge } from './UI';
import { MapPin, Star, Users, Briefcase, Coffee, ShoppingCart, Plus, Minus, Loader } from 'lucide-react';
import { MenuItem, RoomType } from '../types';
import { dataService } from '../services/dataService';

// --- Room Search Bar ---
interface SearchBarProps {
    onSearch: (filters: any) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isWork, setIsWork] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSearch = () => {
      onSearch({ checkIn, checkOut, isWork });
  };

  return (
    <NeonCard className="p-6 flex flex-wrap lg:flex-nowrap gap-4 items-end glass-card sticky top-24 z-40 mx-auto max-w-6xl shadow-2xl gold-border">
      <div className="flex-1 min-w-[200px]">
        <NeonInput type="text" placeholder="Where do you want to stay?" label="Destination" defaultValue="Quetta A1 Hotel" disabled />
      </div>
      
      <div className="flex gap-2 min-w-[250px]">
        <NeonInput 
            type="date" 
            label="Check-in" 
            className="w-full" 
            onChange={(e) => setCheckIn(e.target.value)}
        />
        <NeonInput 
            type="date" 
            label="Check-out" 
            className="w-full"
            onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="min-w-[150px]">
        <label className="text-sm font-medium text-luxury-gold-light tracking-wide block mb-2">Guests</label>
        <div className="h-[50px] glass-card border border-white/10 rounded-xl flex items-center px-4 text-white">
          2 Adults, 1 Room
        </div>
      </div>

      <div className="flex items-center justify-center h-[50px] px-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isWork ? 'bg-luxury-gold border-luxury-gold' : 'border-gray-600'}`}>
             <input type="checkbox" className="hidden" checked={isWork} onChange={() => setIsWork(!isWork)} />
             {isWork && <Briefcase size={12} className="text-luxury-navy" />}
          </div>
          <span className="text-sm text-gray-400 group-hover:text-luxury-gold transition-colors">Business</span>
        </label>
      </div>

      <NeonButton onClick={handleSearch} className="w-full lg:w-auto h-[50px]">
        Check Availability
      </NeonButton>
    </NeonCard>
  );
};

// --- Room List Item ---
export const RoomListItem: React.FC<{ room: RoomType, onBook: (id: string) => void }> = ({ room, onBook }) => {
  return (
    <NeonCard className="flex flex-col md:flex-row overflow-hidden group">
      <div className="w-full md:w-1/3 h-64 md:h-auto relative overflow-hidden">
        <img 
          src={room.image_url} 
          alt={room.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
            {room.rating > 4.5 && <NeonBadge color="gold">Guest Favorite</NeonBadge>}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-3xl font-bold luxury-heading gradient-gold mb-2">{room.name}</h3>
            <div className="flex items-center gap-1 glass-card px-3 py-2 rounded-lg border border-luxury-gold/30">
                <Star size={16} className="text-luxury-gold fill-luxury-gold" />
                <span className="text-white font-bold">{room.rating}</span>
                <span className="text-gray-400 text-xs">({room.reviews_count})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-luxury-gold text-sm mb-4">
            <MapPin size={16} />
            <span>Quetta Cantonment View</span>
            <span className="text-gray-600">|</span>
            <Users size={16} />
            <span>Max {room.max_occupancy} guests</span>
          </div>

          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{room.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {room.amenities.slice(0, 4).map(am => (
              <span key={am} className="text-xs text-gray-400 border border-white/10 rounded-full px-3 py-1.5 glass-card">
                {am}
              </span>
            ))}
            {room.amenities.length > 4 && <span className="text-xs text-gray-500 px-2 py-1">+ {room.amenities.length - 4} more</span>}
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-luxury-gold/20 pt-6">
          <div>
            <span className="text-gray-400 text-sm font-medium">From</span>
            <div className="text-4xl font-bold luxury-heading gradient-gold">${room.base_price}</div>
            <span className="text-xs text-gray-500">per night, taxes included</span>
          </div>
          <NeonButton onClick={() => onBook(room.id)}>
            Reserve Now
          </NeonButton>
        </div>
      </div>
    </NeonCard>
  );
};

// --- In-Room Dining Menu ---
export const DiningMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const loadMenu = async () => {
      const items = await dataService.getMenu();
      setMenuItems(items);
      setLoading(false);
    };
    loadMenu();
  }, []);

  const updateCart = (item: MenuItem, delta: number) => {
    const current = cart.get(item.id) || 0;
    const newQty = Math.max(0, current + delta);
    const newCart = new Map(cart);
    if (newQty === 0) newCart.delete(item.id);
    else newCart.set(item.id, newQty);
    setCart(newCart);
  };

  const placeOrder = async () => {
    if (cart.size === 0) return;
    setOrdering(true);
    
    // Convert cart map to items array
    const orderItems = Array.from(cart.entries()).map(([id, qty]) => ({ id, quantity: qty }));
    const total = Array.from(cart.entries()).reduce<number>((sum, [id, qty]) => {
        const item = menuItems.find(m => m.id === id);
        return sum + (item ? item.price * qty : 0);
    }, 0);

    const success = await dataService.createOrder({
        room_number: "101", // Hardcoded for guest demo
        items: orderItems,
        total
    });

    setOrdering(false);
    if (success) {
        alert("Order placed successfully! The kitchen has received your ticket.");
        setCart(new Map());
    } else {
        alert("Failed to place order. Please try again.");
    }
  };

  const total = Array.from(cart.entries()).reduce<number>((sum, [id, qty]) => {
    const item = menuItems.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  if (loading) return <div className="text-center py-20 text-luxury-gold animate-pulse font-medium text-xl">Loading menu...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold luxury-heading gradient-gold flex items-center gap-3">
          <Coffee size={32} /> Culinary Selection
        </h2>
        <div className="grid gap-6">
          {menuItems.map(item => (
            <NeonCard key={item.id} className="flex p-5 gap-5 items-center hover-lift">
               <img src={item.image_url} className="w-24 h-24 rounded-xl object-cover glass-card border border-luxury-gold/20" alt={item.name} />
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-white">{item.name}</h3>
                    <span className="text-luxury-gold font-bold text-lg">${item.price}</span>
                 </div>
                 <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                 <div className="flex gap-2">
                    {item.dietary_tags.map(tag => (
                        <NeonBadge key={tag} color="blue">{tag}</NeonBadge>
                    ))}
                 </div>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <button onClick={() => updateCart(item, 1)} className="p-2 glass-card border border-luxury-gold/30 rounded-lg hover:bg-luxury-gold/20 text-luxury-gold transition-all"><Plus size={18}/></button>
                 <span className="font-bold w-8 text-center text-lg">{cart.get(item.id) || 0}</span>
                 <button onClick={() => updateCart(item, -1)} className="p-2 glass-card border border-red-500/30 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"><Minus size={18}/></button>
               </div>
            </NeonCard>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">
        <NeonCard className="p-6 sticky top-24 gold-border">
          <h3 className="text-2xl font-bold luxury-heading mb-6 flex items-center gap-3">
            <ShoppingCart size={24} className="text-luxury-gold"/> <span className="gradient-gold">Your Order</span>
          </h3>
          {cart.size === 0 ? (
            <p className="text-gray-500 text-center py-12">Your order is empty</p>
          ) : (
            <div className="space-y-4">
               {Array.from(cart.entries()).map(([id, qty]) => {
                 const item = menuItems.find(m => m.id === id);
                 if (!item) return null;
                 return (
                   <div key={id} className="flex justify-between text-sm py-2">
                      <span className="text-white">{qty}x {item.name}</span>
                      <span className="text-luxury-gold font-semibold">${(item.price * qty).toFixed(2)}</span>
                   </div>
                 );
               })}
               <div className="luxury-divider my-4"></div>
               <div className="flex justify-between font-bold text-xl py-2">
                 <span className="text-white">Total</span>
                 <span className="gradient-gold">${total.toFixed(2)}</span>
               </div>
               <NeonInput placeholder="Special requests..." className="text-sm mt-4" />
               <NeonButton className="w-full mt-4" onClick={placeOrder} disabled={ordering}>
                 {ordering ? <Loader className="animate-spin mx-auto" /> : 'Confirm Order'}
               </NeonButton>
            </div>
          )}
        </NeonCard>
      </div>
    </div>
  );
};
