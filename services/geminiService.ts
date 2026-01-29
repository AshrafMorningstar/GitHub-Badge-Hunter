import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FULL_CONTEXT } from "../data/badges";

// Check if API key exists; if not, we can handle it gracefully in the UI
const apiKey = process.env.API_KEY || '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  if (!ai) {
    throw new Error("API Key not found. Please configure process.env.API_KEY.");
  }

  const chatHistory = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: FULL_CONTEXT,
      temperature: 0.7,
    },
    history: chatHistory
  });

  const result = await chat.sendMessageStream({ message });
  
  // Return a generator that yields text chunks
  async function* streamGenerator() {
    for await (const chunk of result) {
       const c = chunk as GenerateContentResponse;
       if (c.text) {
         yield c.text;
       }
    }
  }

  return streamGenerator();
};

export const generateBadgeImage = async (badgeName: string, emoji: string, description: string): Promise<string | null> => {
  if (!ai) return null;

  try {
    const prompt = `Design a high-quality, 3D glossy circular badge icon for a GitHub achievement named "${badgeName}". 
    The central element must be this emoji: ${emoji}. 
    The theme is: ${description}. 
    Style: premium gamified UI, shiny, vibrant colors, dark mode compatible, isolated on black background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;

  } catch (error) {
    console.error("Image generation failed", error);
    return null;
  }
};