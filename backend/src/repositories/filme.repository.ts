import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class FilmeRepository {

    async createFilme(dados: Prisma.FilmeCreateInput) {
        return prisma.filme.create({
            data: dados
        });
    }

    async createGeneroFilmeRelations(idFilme: number, generosIds: number[]) {
        const data = generosIds.map(idGenero => ({
            idFilme,
            idGenero
        }));

        await prisma.genero_filme.createMany({
            data,
            skipDuplicates: true
        });
    }

    async getAllFilmes() {
        const filmes = await prisma.filme.findMany({
            include: {
                generos: {
                    include: { genero: true }
                }
            }
        });

        return filmes.map(filme => ({
            ...filme,
            generos: filme.generos.map(gf => gf.genero)
        }));
    }


    async getFilmeById(id: number) {
        const filme = await prisma.filme.findUnique({
            where: { id },
            include: {
                generos: {
                    include: {
                        genero: true
                    }
                }
            }
        });

        if (!filme) return null;

        return {
            ...filme,
            generos: filme.generos.map(gf => gf.genero)
        };
    }

    async deleteFilme(id: number) {
        return prisma.filme.delete({ where: { id } });
    }

    async updateFilme(id: number, data: Prisma.FilmeUpdateInput) {
        return prisma.filme.update({
            where: { id },
            data
        });
    }

    async updateGenerosFilme(idFilme: number, generosIds: number[]) {
        //apaga generos antigos
        await prisma.genero_filme.deleteMany({
            where: { idFilme }
        });

        //cria os novos generos
        const data = generosIds.map(idGenero => ({
            idFilme,
            idGenero
        }));

        await prisma.genero_filme.createMany({
            data,
            skipDuplicates: true
        });
    }


}