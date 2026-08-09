-- AlterTable
ALTER TABLE "Homework" ADD COLUMN     "batchId" TEXT,
ADD COLUMN     "classId" TEXT;

-- CreateIndex
CREATE INDEX "Homework_classId_idx" ON "Homework"("classId");

-- CreateIndex
CREATE INDEX "Homework_batchId_idx" ON "Homework"("batchId");

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
