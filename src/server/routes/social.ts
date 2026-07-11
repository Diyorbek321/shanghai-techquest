import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { notify } from '../notifications/notify';
import { checkAchievements } from '../achievements/check';

export const socialRouter = Router();

socialRouter.use(requireAuth);

const ONLINE_WINDOW_MS = 5 * 60 * 1000;

function isOnline(lastSeenAt: Date | null, onlineVisible: boolean): boolean {
  if (!onlineVisible || !lastSeenAt) return false;
  return Date.now() - lastSeenAt.getTime() < ONLINE_WINDOW_MS;
}

export async function areFriends(userA: string, userB: string): Promise<boolean> {
  const friendship = await prisma.friendship.findFirst({
    where: {
      status: 'ACCEPTED',
      OR: [
        { requesterId: userA, addresseeId: userB },
        { requesterId: userB, addresseeId: userA },
      ],
    },
  });
  return !!friendship;
}

socialRouter.get('/friends', async (req, res) => {
  const friendships = await prisma.friendship.findMany({
    where: { OR: [{ requesterId: req.user!.id }, { addresseeId: req.user!.id }] },
    include: {
      requester: { select: { id: true, name: true, avatarUrl: true, lastSeenAt: true, onlineVisible: true } },
      addressee: { select: { id: true, name: true, avatarUrl: true, lastSeenAt: true, onlineVisible: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(
    friendships.map((f) => {
      const isRequester = f.requesterId === req.user!.id;
      const other = isRequester ? f.addressee : f.requester;
      return {
        friendshipId: f.id,
        status: f.status,
        incoming: !isRequester && f.status === 'PENDING',
        friend: {
          id: other.id,
          name: other.name,
          avatar: other.avatarUrl,
          online: isOnline(other.lastSeenAt, other.onlineVisible),
        },
      };
    })
  );
});

socialRouter.post('/friends/:userId/request', async (req, res) => {
  const targetId = req.params.userId;
  if (targetId === req.user!.id) {
    return res.status(400).json({ error: "O'zingizga do'stlik so'rovi yubora olmaysiz." });
  }
  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });
  }
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: req.user!.id, addresseeId: targetId },
        { requesterId: targetId, addresseeId: req.user!.id },
      ],
    },
  });
  if (existing) {
    return res.status(409).json({ error: "Do'stlik so'rovi allaqachon mavjud." });
  }

  const friendship = await prisma.friendship.create({
    data: { requesterId: req.user!.id, addresseeId: targetId },
  });
  await notify(prisma, {
    userId: targetId,
    type: 'INFO',
    title: "Yangi do'stlik so'rovi",
    body: `${req.user!.name} sizga do'stlik so'rovi yubordi.`,
  });
  res.status(201).json(friendship);
});

const respondSchema = z.object({
  accept: z.boolean(),
});

socialRouter.post('/friends/:id/respond', async (req, res) => {
  const parsed = respondSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }
  const friendship = await prisma.friendship.findUnique({ where: { id: req.params.id } });
  if (!friendship || friendship.addresseeId !== req.user!.id) {
    return res.status(404).json({ error: "Do'stlik so'rovi topilmadi." });
  }
  if (friendship.status !== 'PENDING') {
    return res.status(409).json({ error: "Bu so'rov allaqachon javob berilgan." });
  }

  const updated = await prisma.friendship.update({
    where: { id: friendship.id },
    data: { status: parsed.data.accept ? 'ACCEPTED' : 'DECLINED', respondedAt: new Date() },
  });

  if (parsed.data.accept) {
    await notify(prisma, {
      userId: friendship.requesterId,
      type: 'SUCCESS',
      title: "Do'stlik so'rovi qabul qilindi",
      body: `${req.user!.name} sizning do'stlik so'rovingizni qabul qildi.`,
    });
  }

  res.json(updated);
});

socialRouter.get('/messages/:friendId', async (req, res) => {
  const friendId = req.params.friendId;
  if (!(await areFriends(req.user!.id, friendId))) {
    return res.status(403).json({ error: 'Faqat do\'stlar bilan xabar almashishingiz mumkin.' });
  }
  const messages = await prisma.directMessage.findMany({
    where: {
      OR: [
        { senderId: req.user!.id, recipientId: friendId },
        { senderId: friendId, recipientId: req.user!.id },
      ],
    },
    orderBy: { createdAt: 'asc' },
    take: 200,
  });
  res.json(messages);
});

const sendMessageSchema = z.object({
  content: z.string().min(1).max(1000),
});

socialRouter.post('/messages/:friendId', async (req, res) => {
  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }
  const friendId = req.params.friendId;
  if (!(await areFriends(req.user!.id, friendId))) {
    return res.status(403).json({ error: "Faqat do'stlar bilan xabar almashishingiz mumkin." });
  }

  const message = await prisma.directMessage.create({
    data: { senderId: req.user!.id, recipientId: friendId, content: parsed.data.content },
  });

  await checkAchievements(req.user!.id);

  res.status(201).json(message);
});
