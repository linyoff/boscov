import React from "react";
import { Link } from "react-router-dom";
import { Filme } from "../models/Filme";

interface FilmeCardProps {
  filme: Filme;
}

const FilmeCard: React.FC<FilmeCardProps> = ({ filme }) => {
  const {
    id,
    poster,
    nome,
    anoLancamento,
    duracao,
    diretor,
    produtora,
    classificacao,
    generos,
  } = filme;

  return (
    <div className="bg-tertiary rounded-lg overflow-hidden shadow-md text-textPrimary w-48">
      <img
        src={poster}
        alt={`Capa de ${nome}`}
        className="w-full h-60 object-cover"
      />

      <div className="p-3 flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{nome}</h2>
        <p className="text-xs text-textSecondary">
          {anoLancamento} • {duracao} min
        </p>
        <p className="text-xs text-textSecondary">Diretor: {diretor}</p>
        {<p className="text-xs text-textSecondary">Produtora: {produtora}</p>}
        <p className="text-xs text-textSecondary">Classificação: {classificacao}</p>

        {generos?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {generos.map(({ id, descricao }) => (
              <p
                key={id}
                className="bg-secondary text-xs px-1.5 py-0.5 rounded-full text-white"
              >
                {descricao}
              </p>
            ))}
          </div>
        )}

        <Link
          to={`/filme/${id}`}
          className="mt-2 bg-secondary hover:bg-primary transition-colors text-white text-xs font-medium py-1.5 px-3 rounded text-center"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default FilmeCard;
