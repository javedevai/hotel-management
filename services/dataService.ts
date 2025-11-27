import { supabase } from './supabaseClient';
import { RoomType, MenuItem, Order, HousekeepingTask } from '../types';
import { MOCK_ROOM_TYPES, MOCK_MENU, MOCK_ORDERS, MOCK_TASKS } from '../mockData';

export const dataService = {
  // Fetch Room Types
  getRoomTypes: async (): Promise<RoomType[]> => {
    try {
      const { data, error } = await supabase.from('room_types').select('*');
      if (error) throw error;
      if (!data || data.length === 0) return MOCK_ROOM_TYPES;
      return data;
    } catch (e) {
      console.warn("Using mock rooms due to DB error/empty:", e);
      return MOCK_ROOM_TYPES;
    }
  },

  // Fetch Menu
  getMenu: async (): Promise<MenuItem[]> => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) throw error;
      if (!data || data.length === 0) return MOCK_MENU;
      return data;
    } catch (e) {
      console.warn("Using mock menu due to DB error/empty:", e);
      return MOCK_MENU;
    }
  },

  // Fetch Orders
  getOrders: async (): Promise<Order[]> => {
    try {
      // Note: Real implementation would join order_items, but for simplicity we fetch raw
      // This assumes a view or simplified table structure matching the Order interface
      const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                quantity,
                menu_items ( name )
            )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (!data || data.length === 0) return MOCK_ORDERS;

      // Map Supabase join shape to our simple Order interface
      return data.map((o: any) => ({
        id: o.id,
        room_number: o.room_number || 'Unknown', // Assumes orders have room_number or linked booking
        status: o.status,
        total: o.total_price || 0,
        timestamp: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: o.order_items?.map((oi: any) => ({
            name: oi.menu_items?.name || 'Item',
            quantity: oi.quantity
        })) || []
      }));
    } catch (e) {
      console.warn("Using mock orders due to DB error/empty:", e);
      return MOCK_ORDERS;
    }
  },

  // Create Order
  createOrder: async (order: { room_number: string, items: { id: string, quantity: number }[], total: number }) => {
    try {
        // 1. Create Order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({ 
                status: 'pending', 
                total_price: order.total,
                // In a real app, we'd look up the booking_id from the room_number
                notes: `Room ${order.room_number}` 
            })
            .select()
            .single();
            
        if (orderError) throw orderError;

        // 2. Create Order Items
        const itemsPayload = order.items.map(i => ({
            order_id: orderData.id,
            menu_item_id: i.id,
            quantity: i.quantity
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload);
        if (itemsError) throw itemsError;

        return true;
    } catch (e) {
        console.error("Failed to create order:", e);
        return false;
    }
  },

  // Fetch Tasks
  getTasks: async (): Promise<HousekeepingTask[]> => {
    try {
      const { data, error } = await supabase.from('housekeeping_tasks').select('*');
      if (error) throw error;
      if (!data || data.length === 0) return MOCK_TASKS;
      return data;
    } catch (e) {
      console.warn("Using mock tasks due to DB error/empty:", e);
      return MOCK_TASKS;
    }
  },

  // Realtime Subscriptions
  subscribeToOrders: (callback: (payload: any) => void) => {
    return supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
      .subscribe();
  }
};