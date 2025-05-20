import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class GeneroRepository {

    async createGenero(data: Prisma.GeneroCreateInput) {
        return prisma.genero.create({ data });
    }

    async getAllGeneros() {
        return prisma.genero.findMany();
    }

    async getGeneroById(id: number) {
        return prisma.genero.findUnique({ where: { id } });
    }

    async updateGenero(id: number, data: Prisma.GeneroUpdateInput) {
        return prisma.genero.update({
            where: { id },
            data
        });
    }

    async deleteGenero(id: number) {
        return prisma.genero.delete({ where: { id } });
    }
}
