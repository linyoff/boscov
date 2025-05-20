import { GeneroFilmeRepository } from "../repositories/generoFilme.repository";

const generoFilmeRepository = new GeneroFilmeRepository();

export class GeneroFilmeService {

    async create(data: any) {
        return await generoFilmeRepository.create(data);
    }

    async getByFilme(idFilme: number) {
        return await generoFilmeRepository.getByFilme(idFilme);
    }

    async getByGenero(idGenero: number) {
        return await generoFilmeRepository.getByGenero(idGenero);
    }

    async delete(idGenero: number, idFilme: number) {
        return await generoFilmeRepository.delete(idGenero, idFilme);
    }
}
