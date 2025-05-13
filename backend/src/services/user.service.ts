//camada responsável por aplicar regras de negócio
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";

const userRepository = new UserRepository();

export class UserService {

    async createUser(nome: string, apelido: string, email: string, senha: string, data_nascimento: Date){
        //verifica se email já está cadastrado
        const userExist = await userRepository.searchByEmail(email);
        if(userExist) throw new Error("Email já possui cadastro");

        //criptografando senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const dataConvertida = new Date(data_nascimento);
        
        //criando o novo usuário
        const newUser = await userRepository.createUser({nome, apelido, email, senha: senhaCriptografada, data_nascimento: dataConvertida});
        return newUser;
    }

    async login(email: string, senha: string) {
        const user = await userRepository.searchByEmail(email);
        
    }

}