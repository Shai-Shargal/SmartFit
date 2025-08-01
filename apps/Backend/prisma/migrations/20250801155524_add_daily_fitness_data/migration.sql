-- CreateTable
CREATE TABLE "daily_fitness_data" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "steps" INTEGER,
    "calories_burned" INTEGER,
    "active_minutes" INTEGER,
    "distance" DECIMAL(8,2),
    "floors_climbed" INTEGER,
    "heart_rate" INTEGER,
    "sleep_hours" DECIMAL(4,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_fitness_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_fitness_data_user_id_date_key" ON "daily_fitness_data"("user_id", "date");

-- AddForeignKey
ALTER TABLE "daily_fitness_data" ADD CONSTRAINT "daily_fitness_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
