-- CreateTable
CREATE TABLE "WeeklySet" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "fromOrder" INTEGER NOT NULL,
    "toOrder" INTEGER NOT NULL,
    "opensOn" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklySet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyAnswer" (
    "id" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeeklySet_classId_dueAt_idx" ON "WeeklySet"("classId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySet_classId_fromOrder_key" ON "WeeklySet"("classId", "fromOrder");

-- CreateIndex
CREATE INDEX "WeeklyAnswer_userId_idx" ON "WeeklyAnswer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyAnswer_setId_userId_questionId_key" ON "WeeklyAnswer"("setId", "userId", "questionId");

-- AddForeignKey
ALTER TABLE "WeeklySet" ADD CONSTRAINT "WeeklySet_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyAnswer" ADD CONSTRAINT "WeeklyAnswer_setId_fkey" FOREIGN KEY ("setId") REFERENCES "WeeklySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyAnswer" ADD CONSTRAINT "WeeklyAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyAnswer" ADD CONSTRAINT "WeeklyAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

