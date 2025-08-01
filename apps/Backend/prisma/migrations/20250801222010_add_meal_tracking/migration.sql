/*
  Warnings:

  - Added the required column `date` to the `meals` table without a default value. This is not possible if the table is not empty.
  - Made the column `meal_type` on table `meals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "date" DATE NOT NULL,
ALTER COLUMN "meal_type" SET NOT NULL;

-- CreateTable
CREATE TABLE "daily_meal_summaries" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "total_calories" INTEGER,
    "total_protein" DECIMAL(8,2),
    "total_carbs" DECIMAL(8,2),
    "total_fat" DECIMAL(8,2),
    "breakfast_calories" INTEGER,
    "lunch_calories" INTEGER,
    "dinner_calories" INTEGER,
    "snack_calories" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_meal_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_meal_summaries_user_id_date_key" ON "daily_meal_summaries"("user_id", "date");

-- AddForeignKey
ALTER TABLE "daily_meal_summaries" ADD CONSTRAINT "daily_meal_summaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
