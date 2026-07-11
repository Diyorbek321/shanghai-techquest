-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AchievementCondition" ADD VALUE 'XP_REACHED';
ALTER TYPE "AchievementCondition" ADD VALUE 'LEVEL_REACHED';
ALTER TYPE "AchievementCondition" ADD VALUE 'STREAK_REACHED';
ALTER TYPE "AchievementCondition" ADD VALUE 'ELO_REACHED';
ALTER TYPE "AchievementCondition" ADD VALUE 'COINS_BALANCE';
ALTER TYPE "AchievementCondition" ADD VALUE 'BATTLES_WON';
ALTER TYPE "AchievementCondition" ADD VALUE 'SHOP_ITEMS_OWNED';
ALTER TYPE "AchievementCondition" ADD VALUE 'FRIENDS_COUNT';
ALTER TYPE "AchievementCondition" ADD VALUE 'TEAM_JOINED';
ALTER TYPE "AchievementCondition" ADD VALUE 'QUESTS_COMPLETED';
ALTER TYPE "AchievementCondition" ADD VALUE 'HOMEWORK_COMPLETED';
ALTER TYPE "AchievementCondition" ADD VALUE 'GRADES_ABOVE_90';
