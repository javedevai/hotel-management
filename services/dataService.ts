import { supabase } from './supabaseClient';
import { RoomType, MenuItem, Order, HousekeepingTask, Booking, BookingStatus } from '../types';
import { MOCK_ROOM_TYPES, MOCK_MENU, MOCK_ORDERS, MOCK_TASKS, MOCK_BOOKINGS } from '../mockData';

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

  // Get single room type
  getRoomTypeById: async (id: string): Promise<RoomType | undefined> => {
    const rooms = await dataService.getRoomTypes();
    return rooms.find(r => r.id === id);
  },

  // Create Booking
  createBooking: async (bookingData: { user_id: string, room_type_id: string, check_in: string, check_out: string, total: number }) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert({
                user_id: bookingData.user_id,
                room_type_id: bookingData.room_type_id,
                check_in_date: bookingData.check_in,
                check_out_date: bookingData.check_out,
                total_amount: bookingData.total,
                status: BookingStatus.CONFIRMED,
                guests_adults: 2 // Defaulting for simplicity
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Booking failed:", e);
        return null;
    }
  },

  // Get User Bookings
  getUserBookings: async (userId: string): Promise<Booking[]> => {
      try {
          const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                room_types ( name, image_url )
            `)
            .eq('user_id', userId)
            .order('check_in_date', { ascending: false });

          if (error) throw error;
          
          return data.map((b: any) => ({
              id: b.id,
              room_type_name: b.room_types?.name || 'Unknown Room',
              check_in: b.check_in_date,
              check_out: b.check_out_date,
              status: b.status,
              total_amount: b.total_amount,
              image_url: b.room_types?.image_url
          }));
      } catch (e) {
          console.warn("Using mock bookings:", e);
          return MOCK_BOOKINGS;
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

      return data.map((o: any) => ({
        id: o.id,
        room_number: o.room_number || 'Unknown', 
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
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({ 
                status: 'pending', 
                total_price: order.total,
                notes: `Room ${order.room_number}` 
            })
            .select()
            .single();
            
        if (orderError) throw orderError;

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
