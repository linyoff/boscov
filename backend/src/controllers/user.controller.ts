//camada responsável por lidar com req/res http
import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export class UserController {
    createUser = async (req: Request, res: Response) => {
        try {
            const { nome, apelido, email, senha, data_nascimento } = req.body;
            await userService.createUser(nome, apelido, email, senha, data_nascimento);
            return res.status(201).json({ message: "Usuário criado com sucesso" });
        } catch (error: any) {
            if (error.message === "Email já possui cadastro") {
                return res.status(409).json({ error: error.message }); 
            }
            return res.status(400).json({ error: error.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { email, senha } = req.body;
            const token = await userService.login(email, senha);
            return res.status(200).json({message: "Login bem sucedido", token});
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    };
}