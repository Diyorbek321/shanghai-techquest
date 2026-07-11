import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { askGeminiText, GeminiNotConfiguredError } from '../ai/gemini';

export const mentorRouter = Router();

mentorRouter.use(requireAuth);

mentorRouter.get('/messages', async (req, res) => {
  const messages = await prisma.chatMessage.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });
  res.json(messages);
});

const sendSchema = z.object({
  content: z.string().min(1).max(2000),
});

mentorRouter.post('/messages', async (req, res) => {
  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }

  const history = await prisma.chatMessage.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  const conversation = [...history].reverse().map((m) => `${m.role === 'USER' ? 'Talaba' : 'TechSensei'}: ${m.content}`).join('\n');

  const prompt = `
    Siz TechSensei ismli do'stona, dalda beruvchi dasturlash ustozisiz. O'zbek tilida, qisqa va aniq javob bering.
    Talabaga dasturlash tushunchalarini tushuntiring, kod misollari bering, doim ijobiy va rag'batlantiruvchi ohangda gapiring.

    Oldingi suhbat:
    ${conversation || '(hali suhbat yo\'q)'}

    Talaba: ${parsed.data.content}

    TechSensei sifatida javob bering (faqat javob matnini qaytaring, boshqa formatlash shart emas):
  `;

  const userMessage = await prisma.chatMessage.create({
    data: { userId: req.user!.id, role: 'USER', content: parsed.data.content },
  });

  let replyText: string;
  try {
    replyText = await askGeminiText(prompt);
  } catch (err) {
    if (err instanceof GeminiNotConfiguredError) {
      return res.status(500).json({ error: 'GEMINI_API_KEY sozlanmagan.' });
    }
    console.error('Mentor chat error:', err);
    return res.status(500).json({ error: "AI javobini olishning imkoni bo'lmadi." });
  }

  const assistantMessage = await prisma.chatMessage.create({
    data: { userId: req.user!.id, role: 'ASSISTANT', content: replyText.trim() },
  });

  res.status(201).json({ userMessage, assistantMessage });
});
