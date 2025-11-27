// Supabase Schema Structure (for documentation/implementation guidance)
/*
  Table: profiles
  - id: uuid (PK)
  - email: text
  - role: 'guest' | 'staff_front_desk' | 'staff_housekeeping' | 'staff_kitchen' | 'admin'
  - full_name: text

  Table: hotels
  - id: uuid (PK)
  - name: text
  - city: text
  - description: text
  - amenities: jsonb

  Table: room_types
  - id: uuid (PK)
  - hotel_id: uuid (FK)
  - name: text (e.g., "Ziarat Luxury Suite")
  - base_price: number
  - max_occupancy: number
  - description: text
  - amenities: text[]
  - image_url: text

  Table: rooms
  - id: uuid (PK)
  - room_type_id: uuid (FK)
  - room_number: text
  - status: 'available' | 'occupied' | 'dirty' | 'maintenance'

  Table: bookings
  - id: uuid (PK)
  - user_id: uuid (FK)
  - room_id: uuid (FK)
  - check_in_date: date
  - check_out_date: date
  - status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  - total_amount: number
  - is_business_trip: boolean
  - guests_adults: number
  - guests_children: number
*/

export enum UserRole {
  GUEST = 'guest',
  STAFF_FRONT = 'staff_front_desk',
  STAFF_HOUSE = 'staff_housekeeping',
  STAFF_KITCHEN = 'staff_kitchen',
  ADMIN = 'admin'
}

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled'
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
}

export interface RoomType {
  id: string;
  name: string;
  base_price: number;
  max_occupancy: number;
  description: string;
  amenities: string[];
  image_url: string;
  rating: number;
  reviews_count: number;
}

export interface Room {
  id: string;
  room_type_id: string;
  room_number: string;
  status: 'available' | 'occupied' | 'dirty' | 'maintenance';
}

export interface Booking {
  id: string;
  room_type_name: string; // Joined for display
  check_in: string;
  check_out: string;
  status: BookingStatus;
  total_amount: number;
  image_url?: string;
}

export interface MenuItem {
  id: string;
  category: 'breakfast' | 'mains' | 'desserts' | 'beverages';
  name: string;
  description: string;
  price: number;
  dietary_tags: string[];
  image_url: string;
}

export interface Order {
  id: string;
  room_number: string;
  items: { name: string; quantity: number }[];
  status: 'pending' | 'preparing' | 'delivering' | 'delivered';
  total: number;
  timestamp: string;
}

export interface HousekeepingTask {
  id: string;
  room_number: string;
  type: 'clean' | 'turndown' | 'deep_clean';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to?: string;
}

export const AMENITIES_LIST = [
  "Free Wi-Fi", "Pool", "Spa", "Gym", "Parking", "Restaurant", "Room Service", "Airport Shuttle"
];

export const NEIGHBORHOODS = [
  "City Center", "Cantonment", "Jinnah Road", "Airport Area"
];
