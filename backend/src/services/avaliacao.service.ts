import { AvaliacaoRepository } from "../repositories/avaliacao.repository";
import { Prisma } from "@prisma/client";

export class AvaliacaoService {
  private repo = new AvaliacaoRepository();

  async create(data: Prisma.AvaliacaoCreateInput) {
    const { nota } = data;

    if (nota < 0.5 || nota > 5) {
      throw new Error('A nota deve estar entre 0.5 e 5');
    }
    return this.repo.create(data);
  }

  async getByFilme(idFilme: number) {
    return this.repo.getByFilme(idFilme);
  }

  async getByUsuario(idUsuario: number) {
    return this.repo.getByUsuario(idUsuario);
  }

  async update(idUsuario: number, idFilme: number, data: Partial<Prisma.AvaliacaoUpdateInput>) {
    return this.repo.update(idUsuario, idFilme, data);
  }

  async delete(idUsuario: number, idFilme: number) {
    return this.repo.delete(idUsuario, idFilme);
  }

  async getByUsuarioAndFilme(idUsuario: number, idFilme: number) {
    return this.repo.getByUsuarioAndFilme(idUsuario, idFilme);
  }

}
