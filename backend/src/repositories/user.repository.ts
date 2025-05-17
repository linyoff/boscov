//camada responsável por lidar com o banco via prisma
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {

  async createUser(dados: Prisma.UsuarioCreateInput) {
    return prisma.usuario.create({
      data: dados
    });
  }

  async searchByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  }

  async searchById(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  async update(id: number, dados: Partial<Prisma.UsuarioUpdateInput>) {
    return prisma.usuario.update({
      where: { id },
      data: {
        ...dados,
        updatedAt: new Date()
      }
    });
  }

  async updatePassword(userId: number, newPassword: string) {
    return prisma.usuario.update({
      where: { id: userId },
      data: { senha: newPassword },
    });
  }

  async saveRecoveryToken(userId: number, token: string, expiredAt: Date) {
    return prisma.passwordRecoveryToken.create({
      data: {
        token,
        userId,
        expiredAt,
      },
    });
  }

  async searchRecoveryToken(token: string) {
    return prisma.passwordRecoveryToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRecoveryToken(token: string) {
    return prisma.passwordRecoveryToken.delete({ where: { token } });
  }
}

