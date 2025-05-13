import { Router, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.post("/register", async (req: Request, res: Response) => {
    try {
        await userController.createUser(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        await userController.createUser(req, res);
    } catch (error) {
        console.error(error);
    }
});

export default router;

