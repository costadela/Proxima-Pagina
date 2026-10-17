ALTER TABLE "Usuario" ADD COLUMN "nome" TEXT;

UPDATE "Usuario"
SET "nome" = split_part("email", '@', 1)
WHERE "nome" IS NULL;

ALTER TABLE "Usuario" ALTER COLUMN "nome" SET NOT NULL;
