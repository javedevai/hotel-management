import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Hotel, Coffee, MessageSquare, X, Send, LogOut, User } from 'lucide-react';
import { NeonButton, NeonCard, Modal } from './components/UI';
import { SearchBar, RoomListItem, DiningMenu } from './components/GuestModules';
import { KitchenDisplay, HousekeepingView, AnalyticsDashboard } from './components/StaffModules';
import { AuthModalContent } from './components/Auth';
import { Checkout } from './pages/Checkout';
import { MyBookings } from './pages/MyBookings';
import { AuthProvider, useAuth } from './services/authContext';
import { chatWithConcierge } from './services/geminiService';
import { dataService } from './services/dataService';
import { RoomType } from './types';

// --- AI Concierge Chat Widget ---
const AIChatWidget: React.FC<{ rooms: RoomType[] }> = ({ rooms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to Quetta A1 Hotel. I'm your personal concierge. How may I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const aiResponse = await chatWithConcierge(userMsg, rooms);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="bg-gradient-to-br from-luxury-gold to-luxury-gold-light text-luxury-navy w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all hover:scale-110 hover:shadow-[0_0_40px_rgba(212,175,55,0.8)] float-animation"
        >
          <MessageSquare size={26} strokeWidth={2.5} />
        </button>
      )}

      {isOpen && (
        <NeonCard className="w-[380px] h-[550px] flex flex-col p-0 overflow-hidden shadow-2xl fade-in-up gold-border">
          <div className="bg-gradient-to-r from-luxury-gold/20 to-luxury-gold-light/10 p-5 flex justify-between items-center border-b border-luxury-gold/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
               <h3 className="font-bold text-white text-lg">Concierge</h3>
            </div>
            <button onClick={toggleChat} className="text-gray-400 hover:text-luxury-gold transition-all hover:rotate-90 transform duration-300"><X size={22} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-luxury-navy/50 to-luxury-navy-light/50">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} fade-in-up`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm backdrop-blur-sm ${m.role === 'user' ? 'bg-gradient-to-br from-luxury-gold to-luxury-gold-light text-luxury-navy font-medium rounded-br-none shadow-lg' : 'glass-card border border-white/10 text-gray-100 rounded-bl-none'}`}>
                    {m.text}
                  </div>
               </div>
             ))}
             {loading && <div className="text-xs text-luxury-gold animate-pulse ml-2 font-medium">Concierge is typing...</div>}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-luxury-gold/20 glass-card flex gap-3">
            <input 
               className="flex-1 glass-card border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all placeholder-gray-500"
               placeholder="Ask about our services..."
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-gradient-to-br from-luxury-gold to-luxury-gold-light p-3 rounded-xl text-luxury-navy hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all hover:scale-105">
               <Send size={18} strokeWidth={2.5} />
            </button>
          </div>
        </NeonCard>
      )}
    </div>
  );
};

// --- Page Components ---

const Home: React.FC<{ setRoomsContext: (r: RoomType[]) => void, openLogin: () => void }> = ({ setRoomsContext, openLogin }) => {
  const [showResults, setShowResults] = useState(false);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load rooms on mount for both display and context
  useEffect(() => {
    const loadRooms = async () => {
        const data = await dataService.getRoomTypes();
        setRooms(data);
        setRoomsContext(data); // Pass up for AI
        setLoading(false);
    };
    loadRooms();
  }, [setRoomsContext]);

  const handleBook = (roomId: string) => {
    if (!user) {
        openLogin();
        return;
    }
    const params = new URLSearchParams({
        checkIn: filters.checkIn || '',
        checkOut: filters.checkOut || ''
    });
    navigate(`/checkout/${roomId}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="pt-24 pb-16 px-6 text-center max-w-5xl mx-auto">
        <div className="mb-4 inline-block">
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mb-8"></div>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold mb-6 luxury-heading gradient-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] tracking-tight">
          Quetta A1 Hotel
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto font-light leading-relaxed">
          Where Timeless Elegance Meets Modern Luxury
        </p>
        <p className="text-base text-gray-400 max-w-2xl mx-auto">
          Experience unparalleled hospitality in the heart of Quetta
        </p>
        <div className="mt-8">
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto"></div>
        </div>
      </div>
      
      <div className="px-4">
         <SearchBar onSearch={(f) => { setFilters(f); setShowResults(true); }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        {showResults ? (
           <div className="fade-in-up">
              <h2 className="text-3xl font-bold mb-8 text-white luxury-heading">
                <span className="gradient-gold">Available</span> Accommodations
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-luxury-gold to-transparent mb-8"></div>
              {loading ? (
                <div className="text-center py-20 text-luxury-gold animate-pulse font-medium">Checking availability...</div>
              ) : (
                <div className="grid gap-6">
                    {rooms.map(room => (
                        <RoomListItem key={room.id} room={room} onBook={handleBook} />
                    ))}
                </div>
              )}
           </div>
        ) : (
           <div className="text-center py-32">
             <div className="inline-block p-6 rounded-full glass-card gold-border mb-6 float-animation">
                <Hotel size={40} className="text-luxury-gold"/>
             </div>
             <p className="text-gray-400 text-lg">Select your dates to discover our luxury accommodations</p>
           </div>
        )}
      </div>
    </div>
  );
};

const Dining = () => (
  <div className="max-w-6xl mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold mb-4 luxury-heading gradient-gold">In-Room Dining</h1>
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-4"></div>
      <p className="text-gray-400">Exquisite cuisine delivered to your suite</p>
    </div>
    <DiningMenu />
  </div>
);

const StaffDashboard = () => {
  const [tab, setTab] = useState<'overview' | 'housekeeping' | 'kitchen'>('overview');

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
         <h1 className="text-4xl font-bold luxury-heading flex items-center gap-3">
            <LayoutDashboard className="text-luxury-gold" size={36}/>
            <span className="gradient-gold">Staff Dashboard</span>
         </h1>
         <div className="flex glass-card p-1.5 rounded-xl border border-luxury-gold/20">
           {(['overview', 'kitchen', 'housekeeping'] as const).map(t => (
             <button
               key={t}
               onClick={() => setTab(t)}
               className={`px-6 py-3 rounded-lg text-sm capitalize transition-all font-medium ${tab === t ? 'bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-navy shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'text-gray-400 hover:text-white'}`}
             >
               {t}
             </button>
           ))}
         </div>
       </div>

       <div className="animate-fade-in">
         {tab === 'overview' && <AnalyticsDashboard />}
         {tab === 'kitchen' && <KitchenDisplay />}
         {tab === 'housekeeping' && <HousekeepingView />}
       </div>
    </div>
  );
};

const NavBar: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
  const location = useLocation();
  const isStaff = location.pathname.includes('staff');
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 glass-card backdrop-blur-xl border-b border-luxury-gold/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
         <Link to="/" className="text-2xl font-bold luxury-heading flex items-center gap-3 group">
           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-gold to-luxury-gold-light flex items-center justify-center text-luxury-navy font-black shadow-lg group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all">Q</div>
           <span className="gradient-gold">QUETTA A1</span>
         </Link>

         <div className="flex items-center gap-8">
            {!isStaff ? (
              <>
                <Link to="/" className="text-sm font-semibold hover:text-luxury-gold transition-all duration-300 relative group">
                  Stays
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/dining" className="text-sm font-semibold hover:text-luxury-gold transition-all duration-300 relative group">
                  Dining
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300"></span>
                </Link>
                {user && <Link to="/my-bookings" className="text-sm font-semibold hover:text-luxury-gold transition-all duration-300 relative group">
                  My Bookings
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300"></span>
                </Link>}
              </>
            ) : (
              <Link to="/" className="text-sm font-semibold text-luxury-gold hover:text-luxury-gold-light transition-colors">Exit Staff Mode</Link>
            )}
            
            {user ? (
               <div className="flex items-center gap-4">
                   <div className="hidden md:block text-right">
                       <p className="text-xs text-gray-400 font-medium">Welcome back,</p>
                       <p className="text-sm font-bold gradient-gold leading-none">{user.full_name || user.email.split('@')[0]}</p>
                   </div>
                   <button onClick={signOut} className="p-2.5 glass-card border border-white/10 rounded-xl text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all">
                       <LogOut size={18} />
                   </button>
               </div>
            ) : (
               <button onClick={onLoginClick} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-navy font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all hover:scale-105">
                   <User size={18} /> Sign In
               </button>
            )}

            {!user && !isStaff && (
               <Link to="/staff" className="text-xs text-gray-500 hover:text-luxury-gold transition-colors">Staff Portal</Link>
            )}
         </div>
      </div>
    </nav>
  );
}

// --- Main App ---
export default function App() {
  const [roomsContext, setRoomsContext] = useState<RoomType[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <HashRouter>
        <div className="text-slate-200 antialiased selection:bg-luxury-gold/30">
          <NavBar onLoginClick={() => setIsAuthModalOpen(true)} />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home setRoomsContext={setRoomsContext} openLogin={() => setIsAuthModalOpen(true)} />} />
              <Route path="/dining" element={<Dining />} />
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/checkout/:roomId" element={<Checkout />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
          </div>
          <AIChatWidget rooms={roomsContext} />
          
          <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} title="Welcome to Quetta A1">
             <AuthModalContent onSuccess={() => setIsAuthModalOpen(false)} />
          </Modal>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}
