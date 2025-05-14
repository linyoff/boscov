//camada responsável por aplicar regras de negócio
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

}