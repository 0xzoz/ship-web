-- Add NextAuth fields to users
ALTER TABLE "users" ADD COLUMN "image" TEXT;
ALTER TABLE "users" ADD COLUMN "email_verified" TIMESTAMP(3);

-- Update sessions table for NextAuth
ALTER TABLE "sessions" ADD COLUMN "session_token" VARCHAR(255) NOT NULL;
ALTER TABLE "sessions" DROP COLUMN "token_hash";

DROP INDEX IF EXISTS "sessions_token_hash_key";
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- Create accounts table
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "provider_account_id" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(50),
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create verification tokens table
CREATE TABLE "verification_tokens" (
    "identifier" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
