-- CreateTable
CREATE TABLE "public"."Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "projPts" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
