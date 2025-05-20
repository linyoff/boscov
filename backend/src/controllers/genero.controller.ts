import { GeneroService } from "../services/genero.service";
import { Request, Response } from "express";

const generoService = new GeneroService();

export class GeneroController {
    
    createGenero = async (req: Request, res: Response) => {
        try {
            const genero = await generoService.createGenero(req.body);
            return res.status(201).json({ message: "Gênero criado com sucesso", genero });
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    };

    getAllGeneros = async (_: Request, res: Response) => {
        const generos = await generoService.getAllGeneros();
        res.json(generos);
    };

    getGeneroById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const genero = await generoService.getGeneroById(Number(id));
        if (!genero) return res.status(404).json({ error: "Gênero não encontrado" });
        res.json(genero);
    };

    updateGenero = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const genero = await generoService.updateGenero(Number(id), req.body);
            return res.json(genero);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    };

    deleteGenero = async (req: Request, res: Response) => {
        const { id } = req.params;
        await generoService.deleteGenero(Number(id));
        res.status(204).send();
    };
}
