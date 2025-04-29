-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('COMUM', 'ADMIN');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "apelido" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "tipoUsuario" "TipoUsuario" NOT NULL DEFAULT 'COMUM',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filme" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "diretor" TEXT NOT NULL,
    "anoLancamento" INTEGER NOT NULL,
    "duracao" INTEGER NOT NULL,
    "produtora" TEXT NOT NULL,
    "classificacao" TEXT NOT NULL,
    "poster" TEXT NOT NULL,

    CONSTRAINT "Filme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "idUsuario" INTEGER NOT NULL,
    "idFilme" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("idUsuario","idFilme")
);

-- CreateTable
CREATE TABLE "Genero" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Genero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genero_filme" (
    "idGenero" INTEGER NOT NULL,
    "idFilme" INTEGER NOT NULL,

    CONSTRAINT "Genero_filme_pkey" PRIMARY KEY ("idGenero","idFilme")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_idFilme_fkey" FOREIGN KEY ("idFilme") REFERENCES "Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Genero_filme" ADD CONSTRAINT "Genero_filme_idGenero_fkey" FOREIGN KEY ("idGenero") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Genero_filme" ADD CONSTRAINT "Genero_filme_idFilme_fkey" FOREIGN KEY ("idFilme") REFERENCES "Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
