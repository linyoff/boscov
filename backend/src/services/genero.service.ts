import { GeneroRepository } from "../repositories/genero.repository";

const generoRepository = new GeneroRepository();

export class GeneroService {

    async createGenero(data: any) {
        return await generoRepository.createGenero(data);
    }

    async getAllGeneros() {
        return await generoRepository.getAllGeneros();
    }

    async getGeneroById(id: number) {
        return await generoRepository.getGeneroById(id);
    }

    async updateGenero(id: number, data: any) {
        return await generoRepository.updateGenero(id, data);
    }

    async deleteGenero(id: number) {
        return await generoRepository.deleteGenero(id);
    }
}
