import { RoomType, MenuItem, Order, HousekeepingTask, Booking, BookingStatus } from './types';

export const MOCK_ROOM_TYPES: RoomType[] = [
  {
    id: '1',
    name: 'Ziarat Juniper Suite',
    base_price: 150,
    max_occupancy: 2,
    description: 'A luxurious suite inspired by the ancient juniper forests, featuring panoramic city views and a private jacuzzi.',
    amenities: ['Free Wi-Fi', 'Spa', 'Room Service', 'King Bed', 'City View'],
    image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop',
    rating: 4.8,
    reviews_count: 124
  },
  {
    id: '2',
    name: 'Hanna Lake Deluxe',
    base_price: 110,
    max_occupancy: 3,
    description: 'Spacious family room with modern neon accents and soothing blue tones reminiscent of Hanna Lake.',
    amenities: ['Free Wi-Fi', 'Pool', 'Parking', '2 Queen Beds'],
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop',
    rating: 4.5,
    reviews_count: 89
  },
  {
    id: '3',
    name: 'Quetta Business Executive',
    base_price: 95,
    max_occupancy: 1,
    description: 'Designed for the modern traveler with a dedicated ergonomic workspace and high-speed fiber internet.',
    amenities: ['Free Wi-Fi', 'Gym', 'Work Desk', 'Soundproofing'],
    image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2574&auto=format&fit=crop',
    rating: 4.6,
    reviews_count: 210
  }
];

export const MOCK_MENU: MenuItem[] = [
  {
    id: 'm1',
    category: 'mains',
    name: 'Sajji Platter',
    description: 'Traditional Balochi roasted lamb with rice.',
    price: 25,
    dietary_tags: ['GF', 'Halal'],
    image_url: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'm2',
    category: 'breakfast',
    name: 'Quetta Chai & Paratha',
    description: 'Classic doodh patti chai with crispy paratha.',
    price: 8,
    dietary_tags: ['Veg'],
    image_url: 'https://images.unsplash.com/photo-1542365858-3b6aee371efc?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'm3',
    category: 'beverages',
    name: 'Neon Blue Mocktail',
    description: 'Blueberry, lemon, and mint sparkling refresher.',
    price: 6,
    dietary_tags: ['Vegan'],
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    room_number: '302',
    items: [{ name: 'Sajji Platter', quantity: 2 }, { name: 'Neon Blue Mocktail', quantity: 2 }],
    status: 'preparing',
    total: 62,
    timestamp: '10 mins ago'
  },
  {
    id: 'o2',
    room_number: '105',
    items: [{ name: 'Quetta Chai', quantity: 1 }],
    status: 'pending',
    total: 8,
    timestamp: '2 mins ago'
  }
];

export const MOCK_TASKS: HousekeepingTask[] = [
  { id: 't1', room_number: '201', type: 'clean', status: 'pending' },
  { id: 't2', room_number: '204', type: 'turndown', status: 'in_progress', assigned_to: 'Ahmed' },
  { id: 't3', room_number: '105', type: 'deep_clean', status: 'completed', assigned_to: 'Sarah' }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    room_type_name: 'Hanna Lake Deluxe',
    check_in: '2023-11-15',
    check_out: '2023-11-18',
    status: BookingStatus.CONFIRMED,
    total_amount: 330,
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop'
  }
];
