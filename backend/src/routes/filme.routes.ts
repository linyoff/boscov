import e, { Router, Request, Response } from "express";
import { FilmeController } from "../controllers/filme.controller";

const router = Router();
const filmeController = new FilmeController();

router.post("/create", async (req: Request, res: Response) => {
    try {
        await filmeController.createFilme(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        await filmeController.getAllFilmes(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        await filmeController.getFilmeById(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        await filmeController.deleteFilme(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.put("/update/:id", async (req: Request, res: Response) => {
    try {
        await filmeController.updateFilme(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.put("/:id/generos", async (req: Request, res: Response) => {
    try {
        await filmeController.updateGenerosFilme(req, res);
    } catch (error) {
        console.error(error);
    }
});



export default router;
