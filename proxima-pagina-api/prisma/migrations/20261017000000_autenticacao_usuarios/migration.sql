CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Sessao" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sessao_pkey" PRIMARY KEY ("id")
);

DELETE FROM "ItemBiblioteca";
DELETE FROM "Livro" WHERE "ehMeuLivro" = true;

ALTER TABLE "Livro" ADD COLUMN "usuarioId" TEXT;
ALTER TABLE "ItemBiblioteca" ADD COLUMN "usuarioId" TEXT;
ALTER TABLE "ItemBiblioteca" ALTER COLUMN "usuarioId" SET NOT NULL;

DROP INDEX "ItemBiblioteca_livroId_key";
CREATE INDEX "Livro_usuarioId_idx" ON "Livro"("usuarioId");
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE UNIQUE INDEX "Sessao_tokenHash_key" ON "Sessao"("tokenHash");
CREATE INDEX "Sessao_usuarioId_idx" ON "Sessao"("usuarioId");
CREATE INDEX "Sessao_expiraEm_idx" ON "Sessao"("expiraEm");
CREATE UNIQUE INDEX "ItemBiblioteca_usuarioId_livroId_key" ON "ItemBiblioteca"("usuarioId", "livroId");
CREATE INDEX "ItemBiblioteca_usuarioId_atualizadoEm_idx" ON "ItemBiblioteca"("usuarioId", "atualizadoEm");

ALTER TABLE "Livro" ADD CONSTRAINT "Livro_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ItemBiblioteca" ADD CONSTRAINT "ItemBiblioteca_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
