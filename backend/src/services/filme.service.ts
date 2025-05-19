import { FilmeRepository } from "../repositories/filme.repository";

const filmeRepository = new FilmeRepository();

export class FilmeService {

    async createFilme(data: any) {
        return await filmeRepository.createFilme(data);
    }

    async getAllFilmes() {
        return await filmeRepository.getAllFilmes();
    }

    async getFilmeById(id: number) {
        return await filmeRepository.getFilmeById(id);
    }

    async deleteFilme(id: number) {
        return await filmeRepository.deleteFilme(id);
    }

    async updateFilme(id: number, data: any) {
        return await filmeRepository.updateFilme(id, data);
    }

}