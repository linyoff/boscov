import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class GeneroFilmeRepository {

    async create(data: Prisma.Genero_filmeCreateInput) {
        return prisma.genero_filme.create({ data });
    }

    async getByFilme(idFilme: number) {
        return prisma.genero_filme.findMany({
            where: { idFilme },
            include: { genero: true }
        });
    }

    async getByGenero(idGenero: number) {
        return prisma.genero_filme.findMany({
            where: { idGenero },
            include: { filme: true }
        });
    }

    async delete(idGenero: number, idFilme: number) {
        return prisma.genero_filme.delete({
            where: {
                idGenero_idFilme: {
                    idGenero,
                    idFilme
                }
            }
        });
    }
}
