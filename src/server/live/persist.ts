import { prisma } from '../db';
import { xpFor, type Game, type Standing } from './game';

/**
 * Writes a finished game and pays its XP in one transaction — all or nothing.
 * Guests have no account to pay or link a row to, so they are left out; the
 * registered players keep the rank they earned against everyone, guests included.
 */
export async function persistLiveGame(game: Game, table: Standing[]): Promise<void> {
  const results = table.filter((s) => !s.guest).map((s) => ({ ...s, xpAwarded: xpFor(s) }));
  // A guests-only game has nothing to pay and nobody to show it to.
  if (results.length === 0) return;
  await prisma.$transaction([
    prisma.liveGame.create({
      data: {
        hostId: game.hostId,
        lessonId: game.lessonId,
        questionCount: game.questions.length,
        startedAt: new Date(game.startedAt ?? Date.now()),
        results: {
          create: results.map((r) => ({
            userId: r.userId,
            rank: r.rank,
            score: r.score,
            correctCount: r.correctCount,
            xpAwarded: r.xpAwarded,
          })),
        },
      },
    }),
    ...results.map((r) =>
      prisma.user.update({ where: { id: r.userId }, data: { xp: { increment: r.xpAwarded } } })
    ),
  ]);
}
