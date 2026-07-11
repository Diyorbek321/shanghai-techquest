import { NotificationType, Prisma, PrismaClient } from '@prisma/client';

type PrismaOrTx = PrismaClient | Prisma.TransactionClient;

export async function notify(
  client: PrismaOrTx,
  params: { userId: string; type: NotificationType; title: string; body: string }
): Promise<void> {
  await client.notification.create({ data: params });
}

export async function notifyMany(
  client: PrismaOrTx,
  userIds: string[],
  params: { type: NotificationType; title: string; body: string }
): Promise<void> {
  if (userIds.length === 0) return;
  await client.notification.createMany({
    data: userIds.map((userId) => ({ userId, ...params })),
  });
}
