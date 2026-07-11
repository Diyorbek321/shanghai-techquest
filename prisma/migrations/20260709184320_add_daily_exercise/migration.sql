-- CreateTable
CREATE TABLE "DailyExercise" (
    "id" TEXT NOT NULL,
    "track" "Track" NOT NULL,
    "moduleKey" TEXT,
    "prompt" TEXT NOT NULL,
    "estMinutes" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyExerciseLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "DailyExerciseLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyExercise_track_idx" ON "DailyExercise"("track");

-- CreateIndex
CREATE INDEX "DailyExerciseLog_exerciseId_idx" ON "DailyExerciseLog"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyExerciseLog_userId_date_key" ON "DailyExerciseLog"("userId", "date");

-- AddForeignKey
ALTER TABLE "DailyExerciseLog" ADD CONSTRAINT "DailyExerciseLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyExerciseLog" ADD CONSTRAINT "DailyExerciseLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "DailyExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
