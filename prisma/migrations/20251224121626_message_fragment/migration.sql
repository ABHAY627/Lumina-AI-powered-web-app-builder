-- CreateEnum
CREATE TYPE "messageRole" AS ENUM ('RESULT', 'ERROR');

-- CreateEnum
CREATE TYPE "messageType" AS ENUM ('TEXT', 'FRAGMENT');

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" "messageRole" NOT NULL,
    "type" "messageType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fragment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sandboxUrl" TEXT NOT NULL,
    "titles" TEXT NOT NULL,
    "files" JSONB NOT NULL,

    CONSTRAINT "fragment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fragment_messageId_key" ON "fragment"("messageId");

-- AddForeignKey
ALTER TABLE "fragment" ADD CONSTRAINT "fragment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
