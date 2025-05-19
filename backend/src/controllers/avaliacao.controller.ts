import { Request, Response } from "express";
import { AvaliacaoService } from "../services/avaliacao.service";

export class AvaliacaoController {
  private service = new AvaliacaoService();

  async createAvaliacao(req: Request, res: Response) {
    const data = req.body;
    const result = await this.service.create(data);
    res.status(201).json(result);
  }

  async getByFilme(req: Request, res: Response) {
    const { idFilme } = req.params;
    const result = await this.service.getByFilme(Number(idFilme));
    res.json(result);
  }

  async getByUsuario(req: Request, res: Response) {
    const { idUsuario } = req.params;
    const result = await this.service.getByUsuario(Number(idUsuario));
    res.json(result);
  }

  async update(req: Request, res: Response) {
    const { idUsuario, idFilme } = req.params;
    const data = req.body;
    const result = await this.service.update(Number(idUsuario), Number(idFilme), data);
    res.json(result);
  }

  async delete(req: Request, res: Response) {
    const { idUsuario, idFilme } = req.params;
    const result = await this.service.delete(Number(idUsuario), Number(idFilme));
    res.json({ message: "Avaliação removida com sucesso", result });
  }
}
