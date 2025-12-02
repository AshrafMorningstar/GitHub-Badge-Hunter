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

  // Construct the chat history with system instruction
  // Since we are using generateContentStream for a single turn in this simplified demo or maintaining chat state:
  // We will use the chat API for maintaining context.
  
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