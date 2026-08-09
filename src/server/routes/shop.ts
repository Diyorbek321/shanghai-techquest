import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { serializeUser } from '../serializers/user';
import { checkAchievements } from '../achievements/check';
import { MAX_STREAK_FREEZES, isConsumable } from '../shop/consumables';

export const shopRouter = Router();

shopRouter.use(requireAuth);

class InsufficientCoinsError extends Error {}
class AlreadyOwnedError extends Error {}

shopRouter.get('/items', async (_req, res) => {
  const items = await prisma.item.findMany({ orderBy: { price: 'asc' } });
  res.json(items);
});

shopRouter.get('/inventory', async (req, res) => {
  const inventory = await prisma.userInventory.findMany({
    where: { userId: req.user!.id },
    include: { item: true },
  });
  res.json(inventory);
});

const purchaseSchema = z.object({
  itemId: z.string().min(1),
});

shopRouter.post('/purchase', async (req, res) => {
  const parsed = purchaseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }

  const item = await prisma.item.findUnique({ where: { id: parsed.data.itemId } });
  if (!item) {
    return res.status(404).json({ error: 'Mahsulot topilmadi.' });
  }

  // Consumables are stock, not possessions: they add to a counter and can be
  // rebought, so the owned-once rule below must not apply to them.
  if (isConsumable(item.key)) {
    if (req.user!.streakFreezes >= MAX_STREAK_FREEZES) {
      return res.status(409).json({ error: `Ko'pi bilan ${MAX_STREAK_FREEZES} ta muzlatish saqlay olasiz.` });
    }
    try {
      const user = await prisma.$transaction(async (tx) => {
        const { count } = await tx.user.updateMany({
          where: { id: req.user!.id, coins: { gte: item.price } },
          data: { coins: { decrement: item.price }, streakFreezes: { increment: 1 } },
        });
        if (count === 0) throw new InsufficientCoinsError();
        return tx.user.findUniqueOrThrow({ where: { id: req.user!.id } });
      });
      return res.status(201).json({ inventory: null, user: serializeUser(user) });
    } catch (err) {
      if (err instanceof InsufficientCoinsError) {
        return res.status(409).json({ error: 'Tangalar yetarli emas.' });
      }
      throw err;
    }
  }

  const alreadyOwned = await prisma.userInventory.findUnique({
    where: { userId_itemId: { userId: req.user!.id, itemId: item.id } },
  });
  if (alreadyOwned) {
    return res.status(409).json({ error: 'Bu mahsulot allaqachon sizda bor.' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const { count } = await tx.user.updateMany({
        where: { id: req.user!.id, coins: { gte: item.price } },
        data: { coins: { decrement: item.price } },
      });
      if (count === 0) throw new InsufficientCoinsError();

      const inventoryEntry = await tx.userInventory.create({
        data: { userId: req.user!.id, itemId: item.id },
        include: { item: true },
      });
      const user = await tx.user.findUniqueOrThrow({ where: { id: req.user!.id } });
      return { inventoryEntry, user };
    });
    await checkAchievements(req.user!.id);
    res.status(201).json({ inventory: result.inventoryEntry, user: serializeUser(result.user) });
  } catch (err) {
    if (err instanceof InsufficientCoinsError) {
      return res.status(409).json({ error: 'Tangalar yetarli emas.' });
    }
    if (err instanceof AlreadyOwnedError) {
      return res.status(409).json({ error: 'Bu mahsulot allaqachon sizda bor.' });
    }
    throw err;
  }
});
