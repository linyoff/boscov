import { Router, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware"

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
        await userController.login(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get("/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    res.json({ message: "Usuário autenticado", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar perfil" });
  }
});


export default router;

