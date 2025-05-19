import { PrismaClient, Prisma } from "@prisma/client";


const prisma = new PrismaClient();

export class AvaliacaoRepository {
  
  async create(data: Prisma.AvaliacaoCreateInput) {
    return prisma.avaliacao.create({ data });
  }

  async getByFilme(idFilme: number) {
    return prisma.avaliacao.findMany({
      where: { idFilme },
      include: { usuario: true }
    });
  }

  async getByUsuario(idUsuario: number) {
    return prisma.avaliacao.findMany({
      where: { idUsuario },
      include: { filme: true }
    });
  }

  async update(idUsuario: number, idFilme: number, data: Partial<Prisma.AvaliacaoUpdateInput>) {
    return prisma.avaliacao.update({
      where: { idUsuario_idFilme: { idUsuario, idFilme } },
      data
    });
  }

  async delete(idUsuario: number, idFilme: number) {
    return prisma.avaliacao.delete({
      where: { idUsuario_idFilme: { idUsuario, idFilme } }
    });
  }
}
