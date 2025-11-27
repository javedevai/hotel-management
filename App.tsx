import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Hotel, Coffee, MessageSquare, X, Send } from 'lucide-react';
import { NeonButton, NeonCard, NeonInput } from './components/UI';
import { SearchBar, RoomListItem, DiningMenu } from './components/GuestModules';
import { KitchenDisplay, HousekeepingView, AnalyticsDashboard } from './components/StaffModules';
import { chatWithConcierge } from './services/geminiService';
import { dataService } from './services/dataService';
import { RoomType } from './types';

// --- AI Concierge Chat Widget ---
const AIChatWidget: React.FC<{ rooms: RoomType[] }> = ({ rooms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hello! I'm Neon, your Quetta A1 virtual concierge. How can I assist you today?" }
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
          className="bg-cyan-500 hover:bg-cyan-400 text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all animate-bounce"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <NeonCard className="w-[350px] h-[500px] flex flex-col p-0 overflow-hidden shadow-2xl animate-fade-in-up">
          <div className="bg-cyan-900/50 p-4 flex justify-between items-center border-b border-cyan-500/30">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
               <h3 className="font-bold text-white">Neon Concierge</h3>
            </div>
            <button onClick={toggleChat} className="text-slate-400 hover:text-white"><X size={20} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                    {m.text}
                  </div>
               </div>
             ))}
             {loading && <div className="text-xs text-slate-500 animate-pulse ml-2">Neon is thinking...</div>}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-slate-700 bg-slate-900 flex gap-2">
            <input 
               className="flex-1 bg-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 ring-cyan-500"
               placeholder="Ask about rooms or services..."
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-cyan-500 p-2 rounded text-black hover:bg-cyan-400">
               <Send size={16} />
            </button>
          </div>
        </NeonCard>
      )}
    </div>
  );
};

// --- Page Components ---

const Home: React.FC<{ setRoomsContext: (r: RoomType[]) => void }> = ({ setRoomsContext }) => {
  const [showResults, setShowResults] = useState(false);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen pb-20">
      <div className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          Quetta A1 Hotel
        </h1>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Experience luxury reimagined in the heart of Quetta. 
          A fusion of tradition and neon-future elegance.
        </p>
      </div>
      
      <div className="px-4">
         <SearchBar onSearch={() => setShowResults(true)} />
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        {showResults ? (
           <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-cyan-500 pl-4">Available Rooms</h2>
              {loading ? (
                <div className="text-center py-20 text-cyan-400 animate-pulse">Scanning availability...</div>
              ) : (
                <div className="grid gap-6">
                    {rooms.map(room => (
                    <RoomListItem key={room.id} room={room} onBook={(r) => alert(`Booking initiated for ${r.name}`)} />
                    ))}
                </div>
              )}
           </div>
        ) : (
           <div className="text-center py-20 opacity-50">
             <div className="inline-block p-4 rounded-full bg-slate-800 mb-4 animate-bounce">
                <Hotel size={32} className="text-cyan-400"/>
             </div>
             <p>Enter dates to check availability</p>
           </div>
        )}
      </div>
    </div>
  );
};

const Dining = () => (
  <div className="max-w-6xl mx-auto px-4 py-12">
    <h1 className="text-4xl font-bold mb-8 text-white">In-Room Dining</h1>
    <DiningMenu />
  </div>
);

const StaffDashboard = () => {
  const [tab, setTab] = useState<'overview' | 'housekeeping' | 'kitchen'>('overview');

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
         <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="text-cyan-400"/> Staff Command Center
         </h1>
         <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-700">
           {(['overview', 'kitchen', 'housekeeping'] as const).map(t => (
             <button
               key={t}
               onClick={() => setTab(t)}
               className={`px-4 py-2 rounded-md text-sm capitalize transition-all ${tab === t ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'}`}
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

const NavBar = () => {
  const location = useLocation();
  const isStaff = location.pathname.includes('staff');

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
         <Link to="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
           <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-black font-black">Q</div>
           <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">QUETTA A1</span>
         </Link>

         <div className="flex items-center gap-6">
            {!isStaff ? (
              <>
                <Link to="/" className="text-sm font-medium hover:text-cyan-400 transition-colors">Stays</Link>
                <Link to="/dining" className="text-sm font-medium hover:text-cyan-400 transition-colors">Dining</Link>
                <Link to="/staff" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Staff Access</Link>
              </>
            ) : (
              <Link to="/" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Exit Staff Mode</Link>
            )}
            
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:border-cyan-400">
              JS
            </div>
         </div>
      </div>
    </nav>
  );
}

// --- Main App ---
export default function App() {
  const [roomsContext, setRoomsContext] = useState<RoomType[]>([]);

  return (
    <HashRouter>
      <div className="text-slate-200 antialiased selection:bg-cyan-500/30">
        <NavBar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home setRoomsContext={setRoomsContext} />} />
            <Route path="/dining" element={<Dining />} />
            <Route path="/staff" element={<StaffDashboard />} />
          </Routes>
        </div>
        <AIChatWidget rooms={roomsContext} />
      </div>
    </HashRouter>
  );
}