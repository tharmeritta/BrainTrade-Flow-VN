import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      genAI = new GoogleGenAI({ apiKey });
    }
  }
  return genAI;
};

export const generateCoachResponse = async (
  context: string,
  userQuery: string,
  language: Language
): Promise<string> => {
  const ai = getGenAI();
  if (!ai) {
    return language === 'en' 
      ? "API Key not configured." 
      : "Chưa cấu hình API Key.";
  }

  const langName = language === 'en' ? 'English' : 'Vietnamese';
  
  const prompt = `
    You are an expert telesales coach for financial products. 
    Context of current sales stage: "${context}".
    
    User Query: "${userQuery}"
    
    Provide a short, punchy, and effective script or advice for the agent to say or do.
    Respond in ${langName}.
    Keep it under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || (language === 'en' ? "No response." : "Không có phản hồi.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'en' 
      ? "Error connecting to AI assistant." 
      : "Lỗi kết nối với trợ lý AI.";
  }
};
