import { Filme } from "./Filme";
import { Usuario } from "./User";

export interface Avaliacao {
  id: number;
  comentario: string;
  nota: number;
  filme: Filme;
  usuario: Usuario;
}
