-- AlterEnum
ALTER TYPE "Track" ADD VALUE 'BACKEND';

-- DropIndex
DROP INDEX "Assignment_track_moduleKey_key";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "lessonId" TEXT;

-- AlterTable
ALTER TABLE "ClassGroup" ADD COLUMN     "lessonDays" INTEGER[] DEFAULT ARRAY[1, 3, 5]::INTEGER[],
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "lessonId" TEXT,
ALTER COLUMN "starterCodeJs" DROP NOT NULL,
ALTER COLUMN "starterCodePy" DROP NOT NULL,
ALTER COLUMN "starterCodeCpp" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "track" "Track" NOT NULL,
    "order" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "objectives" TEXT[],
    "homeworkMain" TEXT NOT NULL,
    "homeworkReview" TEXT[],
    "homeworkNote" TEXT NOT NULL DEFAULT '',
    "makeEasy" TEXT NOT NULL,
    "makeMedium" TEXT NOT NULL,
    "makeHard" TEXT NOT NULL,
    "quiz" TEXT[],
    "nextTopic" TEXT,
    "nextPrompt" TEXT,
    "slideFile" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'lesson',
    "xpReward" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_key_key" ON "Lesson"("key");

-- CreateIndex
CREATE INDEX "Lesson_track_month_idx" ON "Lesson"("track", "month");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_track_order_key" ON "Lesson"("track", "order");

-- CreateIndex
CREATE INDEX "Assignment_lessonId_idx" ON "Assignment"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_track_classId_moduleKey_key" ON "Assignment"("track", "classId", "moduleKey");

-- CreateIndex
CREATE INDEX "Problem_lessonId_idx" ON "Problem"("lessonId");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

