/*
  Warnings:

  - You are about to drop the column `telefono` on the `Cliente` table. All the data in the column will be lost.
  - Added the required column `password` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "telefono",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "verificationCode" TEXT;

-- AlterTable
ALTER TABLE "Empleado" ADD COLUMN     "password" TEXT,
ADD COLUMN     "verificationCode" TEXT;

-- AlterTable
ALTER TABLE "Vehiculo" ADD COLUMN     "imagenes" TEXT[];
