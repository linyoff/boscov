import { useEffect, useState } from "react";
import HeaderCustom from "../components/Header";
import Button from "../components/CustomButton";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

//formatar data para exibir
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
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    if (user) {
      setEditedName(user.nome ?? "");
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

      const formData = new FormData();
      formData.append("name", editedName);
      formData.append("email", editedEmail);
      if (newPassword) {
        formData.append("password", newPassword);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

      return response.data;
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar alterações.");
    }
  };

  const handleCancelar = () => {
    setEditedName(user?.nome || "");
    setEditedEmail(user?.email || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage(null);
    setIsEditing(false);
    setIsEditingPassword(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderCustom />
      <main className="flex-grow w-full max-w-3xl mx-auto mt-16 px-6 sm:px-10">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary">
            {user?.nome}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-textPrimary">
            {user?.email}
          </p>
          <p className="text-sm sm:text-base text-textSecondary">
            Desde {formatDate(user?.createdAt)}
          </p>
        </div>

        <div>
          {!isEditing && (
            <div className="mt-6">
              <Button onClick={() => { setIsEditing(true); setMessage(""); }}>
                Editar perfil
              </Button>
            </div>
          )}

          {isEditing && (
            <div className="w-full mt-6 space-y-4">
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
            <div className="w-full mt-6 space-y-4 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Alterar senha</h3>
              <input
                type="password"
                placeholder="Senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full border rounded p-2 mb-2"
              />
              <input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full border rounded p-2 mb-2"
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full border rounded p-2"
              />
            </div>
          )}

          {message && (
            <p className="mt-4 text-center text-sm text-yellow-600 font-medium">{message}</p>
          )}

          {(isEditing || isEditingPassword) && (
            <div className="flex gap-4 mt-4">
              <Button onClick={handleSave}>Salvar alterações</Button>
              <Button onClick={handleCancelar}>Cancelar</Button>
            </div>
          )}
        </div>

        <div className="flex justify-start mt-6">
          <Button onClick={logout}>
            Sair
          </Button>
        </div>

        <div className="my-12">
          <h1 className="font-bold text-2xl">Histórico de Montagens</h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}
