-- AlterTable
ALTER TABLE "ClassGroup" ADD COLUMN     "edulyGroupId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "disabledAt" TIMESTAMP(3),
ADD COLUMN     "edulyStudentId" INTEGER,
ADD COLUMN     "edulyTeacherId" INTEGER;

-- CreateTable
CREATE TABLE "SsoNonce" (
    "jti" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SsoNonce_pkey" PRIMARY KEY ("jti")
);

-- CreateIndex
CREATE INDEX "SsoNonce_expiresAt_idx" ON "SsoNonce"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ClassGroup_edulyGroupId_key" ON "ClassGroup"("edulyGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "User_edulyStudentId_key" ON "User"("edulyStudentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_edulyTeacherId_key" ON "User"("edulyTeacherId");

