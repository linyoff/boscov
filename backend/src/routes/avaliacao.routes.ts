import e, { Router, Request, Response } from "express";
import { AvaliacaoController } from "../controllers/avaliacao.controller";

const router = Router();
const avaliacaoController = new AvaliacaoController();

router.post("/create", async (req: Request, res: Response) => {
    try {
        await avaliacaoController.createAvaliacao(req, res);
    } catch (error) {
        console.error(error);
    }
});

//buscar avaliações por filme
router.get("/filme/:idFilme", async (req: Request, res: Response) => {
    try {
        await avaliacaoController.getByFilme(req, res);
    } catch (error) {
        console.error(error);
    }
});

//buscar avaliações por usuário
router.get("/usuario/:idUsuario", async (req: Request, res: Response) => {
    try {
        await avaliacaoController.getByUsuario(req, res);
    } catch (error) {
        console.error(error);
    }
});

//atualizar avaliação de um usuário para um filme
router.put("/update/:idUsuario/:idFilme", async (req: Request, res: Response) => {
    try {
        await avaliacaoController.update(req, res);
    } catch (error) {
        console.error(error);
    }
});

// Deletar avaliação
router.delete("/delete/:idUsuario/:idFilme", async (req: Request, res: Response) => {
    try {
        await avaliacaoController.delete(req, res);
    } catch (error) {
        console.error(error);
    }
});

export default router;
