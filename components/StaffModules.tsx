import React, { useEffect, useState } from 'react';
import { NeonCard, NeonBadge, NeonButton } from './UI';
import { CheckCircle, Clock, ChefHat, Trash2, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Order, HousekeepingTask } from '../types';
import { dataService } from '../services/dataService';

// --- Kitchen Display System (KDS) ---
export const KitchenDisplay: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await dataService.getOrders();
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();

    // Subscribe to real-time updates
    const subscription = dataService.subscribeToOrders(() => {
      console.log("Realtime order update received");
      fetchOrders(); // Re-fetch on any change
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  if (loading) return <div className="text-center py-10">Connecting to Kitchen KDS...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.length === 0 && <div className="text-slate-500 col-span-3 text-center">No active orders.</div>}
      {orders.map(order => (
        <NeonCard key={order.id} className="p-4 flex flex-col h-full border-l-4 border-l-amber-500 animate-fade-in-up">
           <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-2">
             <div>
                <h3 className="font-bold text-lg">Room {order.room_number}</h3>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> {order.timestamp}</span>
             </div>
             <NeonBadge color={order.status === 'preparing' ? 'amber' : 'cyan'}>
                {order.status.toUpperCase()}
             </NeonBadge>
           </div>
           
           <ul className="flex-1 space-y-2 mb-4">
             {order.items.map((item, idx) => (
               <li key={idx} className="flex justify-between items-center text-sm font-medium">
                  <span>{item.quantity}x {item.name}</span>
               </li>
             ))}
           </ul>

           <div className="flex gap-2 mt-auto">
             <NeonButton variant="secondary" className="flex-1 text-xs py-2">Details</NeonButton>
             <NeonButton className="flex-1 text-xs py-2">Complete</NeonButton>
           </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- Housekeeping View ---
export const HousekeepingView: React.FC = () => {
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);

  useEffect(() => {
    dataService.getTasks().then(setTasks);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-slate-900 text-cyan-400 uppercase font-bold text-xs">
            <tr>
                <th className="px-6 py-3">Room</th>
                <th className="px-6 py-3">Task Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Action</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
            {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{task.room_number}</td>
                    <td className="px-6 py-4 capitalize">{task.type.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                        <NeonBadge color={task.status === 'completed' ? 'green' : task.status === 'in_progress' ? 'amber' : 'red'}>
                            {task.status.replace('_', ' ')}
                        </NeonBadge>
                    </td>
                    <td className="px-6 py-4">{task.assigned_to || '-'}</td>
                    <td className="px-6 py-4">
                         <button className="text-cyan-400 hover:text-white transition-colors">Update</button>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Analytics Dashboard ---
const data = [
  { name: 'Mon', occ: 65, rev: 4000 },
  { name: 'Tue', occ: 70, rev: 3000 },
  { name: 'Wed', occ: 85, rev: 5500 },
  { name: 'Thu', occ: 90, rev: 6000 },
  { name: 'Fri', occ: 95, rev: 7200 },
  { name: 'Sat', occ: 100, rev: 8000 },
  { name: 'Sun', occ: 80, rev: 5000 },
];

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <NeonCard className="p-4 flex items-center justify-between">
             <div>
                <p className="text-slate-400 text-xs uppercase font-bold">Occupancy</p>
                <h3 className="text-2xl font-bold text-white">87%</h3>
             </div>
             <Activity className="text-cyan-400" />
          </NeonCard>
          <NeonCard className="p-4 flex items-center justify-between">
             <div>
                <p className="text-slate-400 text-xs uppercase font-bold">ADR</p>
                <h3 className="text-2xl font-bold text-white">$145</h3>
             </div>
             <DollarSign className="text-green-400" />
          </NeonCard>
          <NeonCard className="p-4 flex items-center justify-between">
             <div>
                <p className="text-slate-400 text-xs uppercase font-bold">RevPAR</p>
                <h3 className="text-2xl font-bold text-white">$126</h3>
             </div>
             <TrendingUp className="text-purple-400" />
          </NeonCard>
          <NeonCard className="p-4 flex items-center justify-between">
             <div>
                <p className="text-slate-400 text-xs uppercase font-bold">Orders</p>
                <h3 className="text-2xl font-bold text-white">24</h3>
             </div>
             <ChefHat className="text-amber-400" />
          </NeonCard>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NeonCard className="p-6 h-[300px]">
             <h3 className="text-lg font-bold mb-4 text-cyan-400">Weekly Occupancy</h3>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                    <Bar dataKey="occ" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </NeonCard>

          <NeonCard className="p-6 h-[300px]">
             <h3 className="text-lg font-bold mb-4 text-purple-400">Revenue Trend</h3>
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                    <Line type="monotone" dataKey="rev" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
                </LineChart>
             </ResponsiveContainer>
          </NeonCard>
       </div>
    </div>
  );
};