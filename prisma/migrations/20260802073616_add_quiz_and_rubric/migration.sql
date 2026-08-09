-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "defense" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "rubricScores" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "choices" TEXT[],
    "correctIndex" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "timesSeen" INTEGER NOT NULL DEFAULT 0,
    "timesCorrect" INTEGER NOT NULL DEFAULT 0,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRubric" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "criteria" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "ProjectRubric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizQuestion_lessonId_idx" ON "QuizQuestion"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_lessonId_order_key" ON "QuizQuestion"("lessonId", "order");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_dueAt_idx" ON "QuizAttempt"("userId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAttempt_userId_questionId_key" ON "QuizAttempt"("userId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRubric_lessonId_key" ON "ProjectRubric"("lessonId");

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRubric" ADD CONSTRAINT "ProjectRubric_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
