import React from "react";
import { Link } from "react-router-dom";

interface FilmeCardProps {
  filme: Filme;
}

const FilmeCard: React.FC<FilmeCardProps> = ({ filme }) => {
  return (
    <div className="bg-tertiary rounded-xl overflow-hidden shadow-md text-textPrimary w-72">
      <img
        src={filme.poster}
        alt={`Capa de ${filme.nome}`}
        className="w-full h-96 object-cover"
      />

      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold">{filme.nome}</h2>
        <p className="text-sm text-textSecondary">{filme.anoLancamento} • {filme.duracao} min</p>
        <p className="text-sm text-textSecondary">Diretor: {filme.diretor}</p>
        <p className="text-sm text-textSecondary">Produtora: {filme.produtora}</p>
        <p className="text-sm text-textSecondary">Classificação: {filme.classificacao}</p>

        {filme.generos && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filme.generos.map((g) => (
              <span
                key={g.id}
                className="bg-secondary text-sm px-2 py-0.5 rounded-full text-white"
              >
                {g.nome}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/filmes/${filme.id}`}
          className="mt-4 bg-secondary hover:bg-primary transition-colors text-white font-semibold py-2 px-4 rounded text-center"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default FilmeCard;
