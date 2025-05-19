import { FilmeService } from "../services/filme.service";
import { Request, Response } from "express";

const filmeService = new FilmeService();

export class FilmeController {

    createFilme = async (req: Request, res: Response) => {
        try {
            const filme = await filmeService.createFilme(req.body);
            return res.status(201).json({ message: "Filme criado com sucesso" });
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    };

    getAllFilmes = async (_: Request, res: Response) => {
        const filmes = await filmeService.getAllFilmes();
        res.json(filmes);
    };

    getFilmeById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const filme = await filmeService.getFilmeById(Number(id));
        if (!filme) return res.status(404).json({ error: "Filme não encontrado" });
        res.json(filme);
    };

    deleteFilme = async (req: Request, res: Response) => {
        const { id } = req.params;
        await filmeService.deleteFilme(Number(id));
        res.status(204).send();
    };

    updateFilme = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const filme = await filmeService.updateFilme(Number(id), req.body);
            return res.json(filme);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    };

}

