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
            return res.status(200).json({ message: "Login bem sucedido", token });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    };

    async logout(req: Request, res: Response): Promise<Response> {
        const token = req.headers.authorization?.split(" ")[1];

        try {
            if (!token) {
                return res
                    .status(400)
                    .json({
                        message: "Token não fornecido. Não foi possível realizar o logout.",
                    });
            }

            const msg = await userService.logout(token);

            return res.status(200).json({ message: msg });
        } catch (error: any) {
            console.error(error);
            return res
                .status(500)
                .json({
                    message:
                        error.message || "Erro inesperado. Tente novamente mais tarde.",
                });
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const dados = req.body;

            await userService.updateUser(Number(id), dados);

            return res.status(200).json({ message: "Usuário editado com sucesso!" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    };

    async requestPasswordReset(req: Request, res: Response) {
        const { email } = req.body;
        try {
            await userService.requestPasswordRecovery(email);
            res.status(200).json({ message: "E-mail de recuperação enviado com sucesso." });
        } catch (error) {
            console.error('Erro ao solicitar recuperação de senha:', error);
            res.status(500).json({ error: "Ocorreu um erro ao solicitar a recuperação de senha" })
        }
    }

    async resetPassword(req: Request, res: Response) {
        const { token, newPassword } = req.body;

        try {
            await userService.resetPassword(token, newPassword);
            res.status(200).json({ message: "Senha redefinida com sucesso. " });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: "Ocorreu um erro desconhecido." });
            }
        }
    }

    async getLoggedUser(req: Request, res: Response) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "Token não fornecido." });
        }

        try {
            const user = await userService.buscarUserLogado(token);
            return res.status(200).json(user); //retorna os dados do usuário
        } catch (error: any) {
            console.error(error);
            return res.status(401).json({ message: error.message || "Erro ao buscar usuário" });
        }
    }
}