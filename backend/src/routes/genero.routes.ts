import e, { Router, Request, Response } from "express";
import { GeneroController } from "../controllers";

const router = Router();
const generoController = new GeneroController();

router.post("/create", async (req: Request, res: Response) => {
    try {
        await generoController.createGenero(req, res);
    } catch (error) {
        console.error(error);
    }
});

//listar todos
router.get("/", async (req: Request, res: Response) => {
    try {
        await generoController.getAllGeneros(req, res);
    } catch (error) {
        console.error(error);
    }
});

//buscar por id
router.get("/:id", async (req: Request, res: Response) => {
    try {
        await generoController.getGeneroById(req, res);
    } catch (error) {
        console.error(error);
    }
});

//atualizar gênero
router.put("/update/:id", async (req: Request, res: Response) => {
    try {
        await generoController.updateGenero(req, res);
    } catch (error) {
        console.error(error);
    }
});

//deletar gênero
router.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        await generoController.deleteGenero(req, res);
    } catch (error) {
        console.error(error);
    }
});

export default router;
