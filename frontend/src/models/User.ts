export enum TipoUsuario {
    COMUM = "COMUM",
    ADMIN = "ADMIN"
}

export interface Usuario {
    id: number;
    nome: string;
    apelido?: string;
    email: string;
    senha: string;
    data_nascimento: Date;
    tipoUsuario: TipoUsuario;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}