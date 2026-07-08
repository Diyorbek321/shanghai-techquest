import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Route for Code Review
  app.post('/api/review-code', async (req, res) => {
    try {
      const { code, language } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
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
      const jsonResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : { rating: 5, feedback: responseText, cyberSuggestion: 'Enhance your uplink stability.' };

      res.json(jsonResponse);
    } catch (error) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: 'Failed to process AI review.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
