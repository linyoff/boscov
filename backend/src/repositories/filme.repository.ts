import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class FilmeRepository {

    async createFilme(dados: Prisma.FilmeCreateInput) {
        return prisma.filme.create({
            data: dados
        });
    }

    async getAllFilmes() {
        return prisma.filme.findMany();
    }

    async getFilmeById(id: number) {
        return prisma.filme.findUnique({ where: { id } });
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

}