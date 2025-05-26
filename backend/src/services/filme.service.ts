import { FilmeRepository } from "../repositories/filme.repository";

const filmeRepository = new FilmeRepository();

export class FilmeService {

    async createFilme(data: any) {
        const { generosIds, ...filmeData } = data;

        const filme = await filmeRepository.createFilme(filmeData);

        if (generosIds && generosIds.length > 0) {
            await filmeRepository.createGeneroFilmeRelations(filme.id, generosIds);
        }

        return filme;
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

    async updateGenerosFilme(idFilme: number, generosIds: number[]) {
        return await filmeRepository.updateGenerosFilme(idFilme, generosIds);
    }

}