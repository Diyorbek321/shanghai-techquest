-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'choice',
ADD COLUMN     "code" TEXT,
ADD COLUMN     "expectedOutput" TEXT;
