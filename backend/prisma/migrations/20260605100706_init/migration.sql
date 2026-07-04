-- CreateTable
CREATE TABLE "app_health" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'healthy',
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT NOT NULL DEFAULT '0.1.0',

    CONSTRAINT "app_health_pkey" PRIMARY KEY ("id")
);
