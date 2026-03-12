/*
  Warnings:

  - Added the required column `reminderTimeMinute` to the `notification_preferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reminderTimezone` to the `notification_preferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionOrder` to the `revision_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionSlot` to the `revision_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notification_preferences" ADD COLUMN     "reminderTimeMinute" INTEGER NOT NULL,
ADD COLUMN     "reminderTimezone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "revision_schedules" ADD COLUMN     "sessionOrder" INTEGER NOT NULL,
ADD COLUMN     "sessionSlot" INTEGER NOT NULL;
