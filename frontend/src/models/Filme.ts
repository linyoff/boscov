export interface Genero {
  id: number;
  nome: string;
}

export interface Filme {
  id: number;
  poster: string;
  nome: string;
  anoLancamento: number;
  duracao: number;
  diretor: string;
  produtora: string;
  classificacao: string;
  generos: { id: number; descricao: string }[]; 
}

