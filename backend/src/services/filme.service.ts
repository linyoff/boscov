// src/services/filme.service.ts (Versão final e corrigida, respeitando a arquitetura)

import { FilmeRepository } from "../repositories/filme.repository";
// NÃO precisamos importar PrismaClient aqui, pois o repository o acessa

const filmeRepository = new FilmeRepository();

export class FilmeService {

    async createFilme(data: any) {
        const { generos: generosIds, ...filmeData } = data;

        // console.log("FilmeService - createFilme received data (RAW):", data); // Para depuração
        // console.log("FilmeService - createFilme extracted filmData:", filmeData); // Para depuração
        // console.log("FilmeService - createFilme extracted generosIds:", generosIds); // Para depuração

        try {
            const filme = await filmeRepository.createFilme(filmeData);

            if (Array.isArray(generosIds) && generosIds.length > 0) {
                await filmeRepository.createGeneroFilmeRelations(filme.id, generosIds);
            }

            const createdFilmeWithGeneros = await filmeRepository.getFilmeById(filme.id);
            if (!createdFilmeWithGeneros) {
                throw new Error("Filme criado, mas não foi possível buscar seu registro completo.");
            }
            return createdFilmeWithGeneros;
        } catch (error: any) {
            console.error("Erro no FilmeService.createFilme:", error);
            throw new Error(`Erro ao criar filme: ${error.message || 'Erro desconhecido na criação.'}`);
        }
    }

    async getAllFilmes() {
        return await filmeRepository.getAllFilmes();
    }

    async getFilmeById(id: number) {
        return await filmeRepository.getFilmeById(id);
    }

    async deleteFilme(id: number) {
        try {
            await filmeRepository.deleteAvaliacoesByFilmeId(id);
            await filmeRepository.updateGenerosFilme(id, []);
            const deletedFilme = await filmeRepository.deleteFilme(id);
            return deletedFilme;

        } catch (error: any) {
            console.error("Erro no FilmeService.deleteFilme:", error);
            throw new Error(`Erro ao deletar filme: ${error.message || 'Erro de integridade de dados.'}`);
        }
    }

    async updateFilme(id: number, data: any) {
        const { generos: generosIds, ...filmeData } = data;

        try {
            const updatedFilmeScalar = await filmeRepository.updateFilme(id, filmeData);

            if (Array.isArray(generosIds)) {
                await filmeRepository.updateGenerosFilme(id, generosIds);
            }

            const updatedFilmeWithGeneros = await filmeRepository.getFilmeById(id);
            if (!updatedFilmeWithGeneros) {
                throw new Error("Filme atualizado, mas não foi possível buscar seu registro completo.");
            }
            return updatedFilmeWithGeneros;
        } catch (error: any) {
            console.error("Erro no FilmeService.updateFilme:", error);
            throw new Error(`Erro ao atualizar filme: ${error.message || 'Erro desconhecido na atualização.'}`);
        }
    }

    async updateGenerosFilme(idFilme: number, generosIds: number[]) {
        return await filmeRepository.updateGenerosFilme(idFilme, generosIds);
    }
}