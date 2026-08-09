-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "moduleKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_track_moduleKey_key" ON "Assignment"("track", "moduleKey");
