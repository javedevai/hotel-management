import { GoogleGenAI } from "@google/genai";
import { RoomType } from '../types';

const getClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAa0j3ZpNM9DUdBdN7G0eRdoniwgMHsg1Y';
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

interface ConciergeContext {
    isAuthenticated: boolean;
    userName?: string;
    availableRooms: Array<{
        id: string;
        name: string;
        price: number;
        capacity: number;
        available: boolean;
        roomNumbers: string[];
    }>;
}

export const chatWithConcierge = async (
    userMessage: string, 
    roomsContext: RoomType[], 
    context: ConciergeContext
): Promise<string> => {
    const ai = getClient();
    if (!ai) return "I'm currently offline (API Key missing). Please check with the front desk.";

    // Check if user is asking about booking
    const bookingKeywords = ['book', 'reserve', 'reservation', 'check in', 'stay'];
    const isBookingRequest = bookingKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
    );

    // If booking request and not authenticated, prompt login
    if (isBookingRequest && !context.isAuthenticated) {
        return "To make a reservation, please sign in to your account first. Click the 'Sign In' button at the top right corner. I'm happy to answer any questions about our rooms and amenities in the meantime!";
    }

    // Prepare detailed room information
    const roomsInfo = context.availableRooms.map(r => 
        `${r.name}: $${r.price}/night, up to ${r.capacity} guests, ${r.available ? 'Available' : 'Fully Booked'}, Room Numbers: ${r.roomNumbers.join(', ')}`
    ).join('\n');

    const systemPrompt = `
    You are the AI Concierge for Quetta A1 Hotel - a luxury hotel in Quetta.
    
    Current User Status:
    - Authenticated: ${context.isAuthenticated ? 'Yes' : 'No'}
    ${context.userName ? `- Guest Name: ${context.userName}` : ''}
    
    Available Rooms:
    ${roomsInfo}
    
    Hotel Information:
    - Location: Heart of Quetta, Pakistan
    - Style: Modern Luxury with Traditional Elegance
    - Amenities: 24/7 Concierge, Fine Dining, Spa, Fitness Center
    - Dining: Traditional Sajji, Modern Fusion Cuisine, In-Room Dining
    - Check-in: 2:00 PM | Check-out: 12:00 PM
    
    Instructions:
    1. If user asks about room availability, provide specific room numbers and prices
    2. If user wants to book and IS authenticated, guide them to select dates and room type
    3. If user wants to book and NOT authenticated, politely ask them to sign in first
    4. Answer questions about amenities, dining, location, and services
    5. Be professional, warm, and helpful
    6. Keep responses concise (2-3 sentences max)
    
    User Query: ${userMessage}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
        });
        return response.text || "I apologize, I am having trouble processing that request.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "I am currently undergoing maintenance. Please try again later.";
    }
};