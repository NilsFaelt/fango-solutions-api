/*
  Warnings:

  - A unique constraint covering the columns `[bookmarkId]` on the table `Click` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Click_bookmarkId_key" ON "Click"("bookmarkId");
