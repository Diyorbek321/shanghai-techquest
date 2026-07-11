import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../env';
import { requireAuth } from '../middleware/auth';

export const reviewCodeRouter = Router();

reviewCodeRouter.post('/review-code', requireAuth, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!env.geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY sozlanmagan.' });
    }

    const genAI = new GoogleGenerativeAI(env.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      As a senior cybernetic engineer, review the following ${language} code.
      Provide constructive feedback on:
      1. Code quality and efficiency.
      2. Potential bugs or security risks.
      3. One "cyber-themed" suggestion for improvement.

      Format the response as JSON with the following structure:
      {
        "rating": number (1-10),
        "feedback": string (markdown),
        "cyberSuggestion": string
      }

      Code:
      \`\`\`${language}
      ${code}
      \`\`\`
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Attempt to parse JSON from the response (sometimes Gemini wraps it in code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonResponse = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { rating: 5, feedback: responseText, cyberSuggestion: 'Enhance your uplink stability.' };

    res.json(jsonResponse);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: "AI tekshiruvini bajarib bo'lmadi." });
  }
});
