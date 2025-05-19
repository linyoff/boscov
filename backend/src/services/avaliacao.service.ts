import { AvaliacaoRepository } from "../repositories/avaliacao.repository";
import { Prisma } from "@prisma/client";

export class AvaliacaoService {
  private repo = new AvaliacaoRepository();

  async create(data: Prisma.AvaliacaoCreateInput) {
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
}
