-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "action_description" TEXT NOT NULL,
    "microservice_name" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "is_admin_action" BOOLEAN NOT NULL DEFAULT false,
    "log_body" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_created_at_idx" ON "logs"("created_at");

-- CreateIndex
CREATE INDEX "logs_actorId_created_at_idx" ON "logs"("actorId", "created_at");

-- CreateIndex
CREATE INDEX "logs_action_created_at_idx" ON "logs"("action", "created_at");
