-- AlterTable
ALTER TABLE "DailyExerciseLog" ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileUrl" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileUrl" TEXT;
