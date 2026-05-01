import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
  console.warn('⚠️ GEMINI_API_KEY is not set correctly in .env');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  systemInstruction: "You are a helpful German language learning assistant named DeutschFlow AI. Your goal is to help users learn German. Always respond primarily in German, but provide English translations or explanations if the user seems confused. Keep your tone encouraging and professional.",
});

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // --- SAFETY FILTER: Ensure history starts with 'user' ---
    let cleanHistory = history || [];
    while (cleanHistory.length > 0 && cleanHistory[0].role !== 'user') {
      cleanHistory.shift();
    }

    const chat = model.startChat({
      history: cleanHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Check for rate limit error
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      res.status(429).json({ error: 'The AI assistant is taking a short break. Please wait 30 seconds and try again.' });
    } else {
      const errorMessage = error.message || 'Failed to get response from AI assistant.';
      res.status(500).json({ error: errorMessage });
    }
  }
});

export default router;
