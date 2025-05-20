import { GeneroFilmeService } from "../services/generoFilme.service";
import { Request, Response } from "express";

const generoFilmeService = new GeneroFilmeService();

export class GeneroFilmeController {

    create = async (req: Request, res: Response) => {
        try {
            const data = await generoFilmeService.create(req.body);
            return res.status(201).json({ message: "Relação gênero-filme criada", data });
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    };

    getByFilme = async (req: Request, res: Response) => {
        const { idFilme } = req.params;
        const generos = await generoFilmeService.getByFilme(Number(idFilme));
        res.json(generos);
    };

    getByGenero = async (req: Request, res: Response) => {
        const { idGenero } = req.params;
        const filmes = await generoFilmeService.getByGenero(Number(idGenero));
        res.json(filmes);
    };

    delete = async (req: Request, res: Response) => {
        const { idGenero, idFilme } = req.params;
        await generoFilmeService.delete(Number(idGenero), Number(idFilme));
        res.status(204).send();
    };
}
