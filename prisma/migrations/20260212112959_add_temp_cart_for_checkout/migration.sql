-- CreateTable
CREATE TABLE "TempCart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TempCart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TempCart_userId_idx" ON "TempCart"("userId");
