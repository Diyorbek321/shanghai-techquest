-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('RESIDENTIAL', 'TECH', 'INDUSTRIAL', 'MONUMENT');

-- CreateTable
CREATE TABLE "Building" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BuildingType" NOT NULL,
    "position" JSONB NOT NULL,
    "color" TEXT NOT NULL,
    "secondaryColor" TEXT,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
