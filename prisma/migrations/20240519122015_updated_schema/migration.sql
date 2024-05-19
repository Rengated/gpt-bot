-- CreateTable
CREATE TABLE "User" (
    "chat_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_subs" (
    "sub_id" SERIAL NOT NULL,

    CONSTRAINT "User_subs_pkey" PRIMARY KEY ("sub_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_chat_id_key" ON "User"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_model_id_key" ON "User"("model_id");

-- CreateIndex
CREATE INDEX "User_model_id_idx" ON "User"("model_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
