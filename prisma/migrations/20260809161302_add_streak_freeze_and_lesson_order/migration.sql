-- AlterTable
ALTER TABLE "DailyExercise" ADD COLUMN     "lessonOrder" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "streakFreezes" INTEGER NOT NULL DEFAULT 0;
