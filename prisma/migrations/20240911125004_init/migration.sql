-- CreateTable
CREATE TABLE "Opportunity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "company" TEXT NOT NULL,
    "type_opportunity" TEXT NOT NULL,
    "remote" BOOLEAN NOT NULL,
    "domain" TEXT,
    "url" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "begin_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),
    "closed" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);
