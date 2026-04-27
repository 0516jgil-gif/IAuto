/*
  Warnings:

  - You are about to drop the column `puesto` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `Empleado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "puesto",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "rol" TEXT NOT NULL DEFAULT 'empleado';

-- DropTable
DROP TABLE "Admin";
