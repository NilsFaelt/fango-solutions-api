/*
  Warnings:

  - You are about to drop the column `userEmail` on the `BookmarkChildren` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookmarkChildren" DROP CONSTRAINT "BookmarkChildren_userEmail_fkey";

-- AlterTable
ALTER TABLE "BookmarkChildren" DROP COLUMN "userEmail";
