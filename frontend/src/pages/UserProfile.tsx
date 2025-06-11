import { useEffect, useState } from "react";
import HeaderCustom from "../components/Header";
import Button from "../components/CustomButton";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { Link } from "react-router-dom";

// formatar data para exibir
const formatDate = (isoDate?: string | Date) => {
  if (!isoDate) return "Data desconhecida";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Data inválida";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function UserProfile() {
  const { user, token, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedApelido, setEditedApelido] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    if (user) {
      setEditedName(user.nome ?? "");
      setEditedApelido(user.apelido ?? "");
      setEditedEmail(user.email ?? "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      if (newPassword && newPassword !== confirmPassword) {
        setMessage("As senhas não coincidem.");
        return;
      }

      const id = user?.id;
      if (!id) {
        setMessage("Usuário não identificado.");
        return;
      }

      const payload = {
        nome: editedName,
        email: editedEmail,
        apelido: editedApelido,
        senha: newPassword || undefined, // só manda se tiver senha
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Informações salvas com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditing(false);
      setIsEditingPassword(false);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar alterações.");
    }
  };


  const handleCancelar = () => {
    setEditedName(user?.nome || "");
    setEditedEmail(user?.email || "");
    setEditedApelido(user?.apelido || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage(null);
    setIsEditing(false);
    setIsEditingPassword(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary">
      <HeaderCustom />

      <main className="max-w-3xl mx-auto w-full px-6 sm:px-10 py-12 space-y-10 bg-primary text-primary min-h-screen">

        <section className="space-y-1 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary">{user?.nome}</h2>
          <p className="text-base sm:text-lg md:text-xl text-textPrimary">{user?.apelido}</p>
          <p className="text-base sm:text md:text text-textPrimary">{user?.email}</p>
          <p className="text-sm sm:text-base text-textSecondary">
            Desde {formatDate(user?.createdAt)}
          </p>
        </section>

        <section>
          {!isEditing && (
            <Button onClick={() => { setIsEditing(true); setMessage(""); }}>
              Editar perfil
            </Button>
          )}

          {isEditing && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mt-1 w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apelido</label>
                <input
                  type="text"
                  value={editedApelido}
                  onChange={(e) => setEditedApelido(e.target.value)}
                  className="mt-1 w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="mt-1 w-full border rounded p-2"
                />
              </div>
              <button
                onClick={() => setIsEditingPassword(true)}
                className="text-sm text-yellow-600 hover:underline"
              >
                Alterar senha
              </button>
            </div>
          )}

          {isEditingPassword && (
            <div className="space-y-4 border-t pt-4 mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Alterar senha</h3>
              <input
                type="password"
                placeholder="Senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          )}

          {message && (
            <p className="mt-4 text-sm text-yellow-600 text-center">{message}</p>
          )}

          {(isEditing || isEditingPassword) && (
            <div className="flex flex-wrap gap-4 mt-4">
              <Button onClick={handleSave}>Salvar alterações</Button>
              <Button onClick={handleCancelar}>Cancelar</Button>
            </div>
          )}
        </section>

        <section>
          <Button onClick={logout}>
            Sair da conta
          </Button>
        </section>

        <div className="mt-6 text-center sm:text-left">
          <Link
            to="/avaliacoes"
            className="inline-block bg-secondary hover:bg-primary text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Ver todos os filmes avaliados
          </Link>
        </div>


      </main>

      <Footer />
    </div>
  );
}
