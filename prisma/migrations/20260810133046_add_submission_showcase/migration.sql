-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "showcaseNote" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "showcased" BOOLEAN NOT NULL DEFAULT false;
