import { GoogleGenAI } from "@google/genai";
import { RoomType } from '../types';

const getClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

export const chatWithConcierge = async (userMessage: string, roomsContext: RoomType[]): Promise<string> => {
    const ai = getClient();
    if (!ai) return "I'm currently offline (API Key missing). Please check with the front desk.";

    const roomsInfo = roomsContext.length > 0 
        ? roomsContext.map(r => `${r.name} ($${r.base_price})`).join(', ') 
        : "standard luxury suites";

    const context = `
    You are 'Neon', the AI Concierge for Quetta A1 Hotel.
    Tone: Professional, futuristic, helpful, and concise.
    
    Hotel Info:
    - Located in the heart of Quetta.
    - Style: Cyberpunk/Neon Luxury.
    - Rooms: ${roomsInfo}.
    - Dining: We serve traditional Sajji and modern fusion.
    
    User Query: ${userMessage}
    
    Answer the user briefly. If they ask about rooms, recommend based on the list provided.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: context,
        });
        return response.text || "I apologize, I am having trouble processing that request.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "I am currently undergoing maintenance. Please try again later.";
    }
};