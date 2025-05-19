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

router.post("/logout", async (req: Request, res: Response) => {
  try {
    await userController.logout(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.post("/recuperar-senha", async (req: Request, res: Response) => {
  try {
    await userController.requestPasswordReset(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.post("/redefinir-senha", async (req: Request, res: Response) => {
  try {
    await userController.resetPassword(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/logado", authenticateToken, async (req: Request, res: Response) => {
  try {
    await userController.getLoggedUser(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.put("/update/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      await userController.update(req, res);
    } catch (error) {
      console.error(error);
    }
  }
);



export default router;

