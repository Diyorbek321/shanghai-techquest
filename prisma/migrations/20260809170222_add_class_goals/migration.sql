-- CreateEnum
CREATE TYPE "ClassGoalMetric" AS ENUM ('PROBLEMS_SOLVED', 'DAILY_EXERCISES', 'HOMEWORK_DONE');

-- CreateTable
CREATE TABLE "ClassGoal" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metric" "ClassGoalMetric" NOT NULL,
    "target" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "achievedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassGoal_classId_idx" ON "ClassGoal"("classId");

-- AddForeignKey
ALTER TABLE "ClassGoal" ADD CONSTRAINT "ClassGoal_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
