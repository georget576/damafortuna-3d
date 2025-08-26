-- CreateEnum
CREATE TYPE "public"."Suit" AS ENUM ('WANDS', 'CUPS', 'SWORDS', 'PENTACLES');

-- CreateEnum
CREATE TYPE "public"."Arcana" AS ENUM ('MAJOR', 'MINOR');

-- CreateEnum
CREATE TYPE "public"."SpreadType" AS ENUM ('SINGLE', 'THREE_CARD', 'CELTIC_CROSS', 'CUSTOM');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deck" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TarotCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "arcana" "public"."Arcana" NOT NULL,
    "suit" "public"."Suit",
    "number" INTEGER,
    "keywords" TEXT[],
    "meaningUpright" TEXT,
    "meaningReversed" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "significance" TEXT,
    "deckId" TEXT NOT NULL,

    CONSTRAINT "TarotCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reading" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "spreadType" "public"."SpreadType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReadingCard" (
    "id" TEXT NOT NULL,
    "readingId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isReversed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReadingCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readingId" TEXT NOT NULL,
    "title" TEXT,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Deck_name_key" ON "public"."Deck"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_readingId_key" ON "public"."JournalEntry"("readingId");

-- AddForeignKey
ALTER TABLE "public"."TarotCard" ADD CONSTRAINT "TarotCard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reading" ADD CONSTRAINT "Reading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reading" ADD CONSTRAINT "Reading_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReadingCard" ADD CONSTRAINT "ReadingCard_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "public"."Reading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReadingCard" ADD CONSTRAINT "ReadingCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."TarotCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JournalEntry" ADD CONSTRAINT "JournalEntry_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "public"."Reading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
