-- AlterTable
ALTER TABLE "DailyExercise" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyExercise_key_key" ON "DailyExercise"("key");

