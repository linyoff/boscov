//camada responsável por lidar com o banco via prisma
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {

    async createUser (dados: Prisma.UserCreateInput){
        return prisma.user.create({
            data: dados
        });
    }

    async searchByEmail (email: string){
        return prisma.user.findUnique({where: {email}});
    }

    async searchById (id: number){
        return prisma.user.findUnique({where: {id}});
    }

}

