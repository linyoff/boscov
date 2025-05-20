import e, { Router, Request, Response } from "express";
import { GeneroFilmeController } from "../controllers/genero_filme.controller";

const router = Router();
const generoFilmeController = new GeneroFilmeController();

// Criar vínculo entre gênero e filme
router.post("/create", async (req: Request, res: Response) => {
    try {
        await generoFilmeController.create(req, res);
    } catch (error) {
        console.error(error);
    }
});

// Buscar todos os gêneros de um filme
router.get("/filme/:idFilme", async (req: Request, res: Response) => {
    try {
        await generoFilmeController.getByFilme(req, res);
    } catch (error) {
        console.error(error);
    }
});

// Buscar todos os filmes de um gênero
router.get("/genero/:idGenero", async (req: Request, res: Response) => {
    try {
        await generoFilmeController.getByGenero(req, res);
    } catch (error) {
        console.error(error);
    }
});

// Deletar vínculo gênero-filme
router.delete("/delete/:idGenero/:idFilme", async (req: Request, res: Response) => {
    try {
        await generoFilmeController.delete(req, res);
    } catch (error) {
        console.error(error);
    }
});

export default router;
