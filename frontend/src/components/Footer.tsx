import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-textPrimary py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-sm">&copy; {new Date().getFullYear()} Boscov. Todos os direitos reservados.</span>

        <div className="flex gap-4 text-sm">
          <Link to="/" className="hover:underline">Início</Link>
          <Link to="/about" className="hover:underline">Sobre</Link>
          <Link to="/contact" className="hover:underline">Contato</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
