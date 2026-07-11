import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../env';

export class GeminiNotConfiguredError extends Error {}

function requireClient() {
  if (!env.geminiApiKey) {
    throw new GeminiNotConfiguredError();
  }
  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

export async function askGeminiJson<T>(prompt: string, fallback: T): Promise<T> {
  const model = requireClient();
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  return jsonMatch ? (JSON.parse(jsonMatch[0]) as T) : fallback;
}

export async function askGeminiText(prompt: string): Promise<string> {
  const model = requireClient();
  const result = await model.generateContent(prompt);
  return result.response.text();
}
