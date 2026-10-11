-- CreateTable
CREATE TABLE "LiveGame" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveGameResult" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "xpAwarded" INTEGER NOT NULL,

    CONSTRAINT "LiveGameResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LiveGame_hostId_finishedAt_idx" ON "LiveGame"("hostId", "finishedAt");

-- CreateIndex
CREATE INDEX "LiveGameResult_userId_idx" ON "LiveGameResult"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveGameResult_gameId_userId_key" ON "LiveGameResult"("gameId", "userId");

-- AddForeignKey
ALTER TABLE "LiveGame" ADD CONSTRAINT "LiveGame_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveGame" ADD CONSTRAINT "LiveGame_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveGameResult" ADD CONSTRAINT "LiveGameResult_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "LiveGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveGameResult" ADD CONSTRAINT "LiveGameResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
