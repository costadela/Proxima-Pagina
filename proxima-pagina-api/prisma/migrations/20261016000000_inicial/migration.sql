-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "StatusLeitura" AS ENUM ('QUERO_LER', 'LENDO', 'JA_LI');

-- CreateTable
CREATE TABLE "Livro" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "ano" INTEGER,
    "paginas" INTEGER,
    "idioma" TEXT NOT NULL DEFAULT 'Português',
    "capaUrl" TEXT,
    "sinopse" TEXT,
    "ehMeuLivro" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemBiblioteca" (
    "id" TEXT NOT NULL,
    "livroId" TEXT NOT NULL,
    "status" "StatusLeitura" NOT NULL DEFAULT 'QUERO_LER',
    "avaliacao" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemBiblioteca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Livro_titulo_idx" ON "Livro"("titulo");

-- CreateIndex
CREATE INDEX "Livro_autor_idx" ON "Livro"("autor");

-- CreateIndex
CREATE INDEX "Livro_categoria_idx" ON "Livro"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "ItemBiblioteca_livroId_key" ON "ItemBiblioteca"("livroId");

-- AddForeignKey
ALTER TABLE "ItemBiblioteca" ADD CONSTRAINT "ItemBiblioteca_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
