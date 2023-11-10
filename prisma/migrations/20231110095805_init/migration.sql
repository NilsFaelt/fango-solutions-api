/*
  Warnings:

  - Made the column `alias` on table `Bookmark` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Bookmark" ALTER COLUMN "alias" SET NOT NULL;
