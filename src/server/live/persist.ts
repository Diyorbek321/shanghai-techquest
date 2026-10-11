import { prisma } from '../db';
import { xpFor, type Game, type Standing } from './game';

/** Writes a finished game and pays its XP in one transaction — all or nothing. */
export async function persistLiveGame(game: Game, table: Standing[]): Promise<void> {
  const results = table.map((s) => ({ ...s, xpAwarded: xpFor(s) }));
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
