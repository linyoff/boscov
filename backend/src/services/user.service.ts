//camada responsável por aplicar regras de negócio
import { Prisma } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { blackListToken } from "../middlewares/auth.middleware";
import nodemailer from "nodemailer";

const userRepository = new UserRepository();

export class UserService {

    async createUser(nome: string, apelido: string, email: string, senha: string, data_nascimento: Date) {
        //verifica se email já está cadastrado
        const userExist = await userRepository.searchByEmail(email);
        if (userExist) throw new Error("Email já possui cadastro");

        //criptografando senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const dataConvertida = new Date(data_nascimento);

        //criando o novo usuário
        const newUser = await userRepository.createUser({ nome, apelido, email, senha: senhaCriptografada, data_nascimento: dataConvertida });
        return newUser;
    }

    async login(email: string, senha: string) {
        const user = await userRepository.searchByEmail(email);
        if (!user) throw new Error("Credenciais não encontradas");

        const correctPassword = await bcrypt.compare(senha, user.senha);
        if (!correctPassword) throw new Error("Credenciais não encontradas");

        if (!process.env.SECRET_JWT) throw new Error("SECRET_JWT não definido!");

        const token = jwt.sign({ id: user.id, email: user.email, tipoUsuario: user.tipoUsuario }, process.env.SECRET_JWT, { expiresIn: "24h" });
        return token;
    }

    async logout(token: string): Promise<string> {
        try {
            blackListToken(token);
            return "Logout realizado com sucesso!";
        } catch (error) {
            throw new Error("Erro ao tentar realizar o logout. Tente novamente mais tarde.");
        }
    }

    async updateUser(id: number, data: Prisma.UsuarioUpdateInput) {
        if (data.email) {
            const existingUser = await userRepository.searchByEmail(data.email as string);
            if (existingUser && existingUser.id !== id) {
                throw new Error("Email already registered.");
            }
        }

        if (data.senha) {
            await this.updatePassword(id, data.senha as string);
            delete data.senha;
        }

        data.updatedAt = new Date();

        const updatedUser = await userRepository.update(id, data);
        return updatedUser;
    }


    async updatePassword(id: number, newPassword: string) {
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        return await userRepository.updatePassword(id, encryptedPassword);
    }


    async requestPasswordRecovery(email: string) {
        const user = await userRepository.searchByEmail(email);
        if (!user) throw new Error("User not found.");

        const token = randomUUID();
        const expiration = new Date(Date.now() + 30 * 60 * 1000);

        await userRepository.saveRecoveryToken(user.id, token, expiration);

        const link = `http://localhost:5173/reset-password?token=${token}`;

        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "0f26d58beca21d",
                pass: "d75fb9092aa5df"
            }
        });

        await transporter.sendMail({
            from: "noreply@bumblebuild.com",
            to: email,
            subject: "Password Recovery",
            html: `<p>Click the link to reset your password:</p><a href="${link}">${link}</a>`
        });

        return "Password recovery email sent successfully!";
    }

    async resetPassword(token: string, newPassword: string) {
        const tokenInfo = await userRepository.searchRecoveryToken(token);
        if (!tokenInfo) throw new Error("Invalid or expired token.");

        const now = new Date();
        if (tokenInfo.expiredAt < now) throw new Error("Token expired.");

        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        await userRepository.updatePassword(tokenInfo.userId, encryptedPassword);

        await userRepository.deleteRecoveryToken(token);

        return "Password reset successfully!";
    }

    async buscarUserLogado(token: string) {
        if (!process.env.SECRET_JWT) throw new Error("SECRET_JWT não definido!");

        const decoded = jwt.verify(token, process.env.SECRET_JWT as string) as { id: number };
        const user = await userRepository.searchById(decoded.id);
        if (!user) throw new Error("Usuário não encontrado");

        return user;
    }

}