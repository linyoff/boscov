import { Filme } from "./Filme";

export interface Avaliacao {
  id: number;
  comentario: string;
  data: Date;
  filme: Filme;
  usuario: User;
}
