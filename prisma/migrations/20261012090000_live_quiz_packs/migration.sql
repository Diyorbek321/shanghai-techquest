-- A live game can now come from a question pack instead of a lesson.
ALTER TABLE "LiveGame" ALTER COLUMN "lessonId" DROP NOT NULL;
ALTER TABLE "LiveGame" ADD COLUMN "packKey" TEXT;
