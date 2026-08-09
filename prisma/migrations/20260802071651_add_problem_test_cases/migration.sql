-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "testCases" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "ProblemSubmission" ADD COLUMN     "testsPassed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "testsTotal" INTEGER NOT NULL DEFAULT 0;
