import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/CustomButton";
import { LogoPrimary } from "../components/Logo";
import axios from "axios";

export default function Auth() {
  const [form, setForm] = useState({
    nome: "",
    apelido: "",
    dataNasc: "",
    email: "",
    senha: "",
    confirmaSenha: ""
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (form.senha !== form.confirmaSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/user/register", {
        nome: form.nome,
        apelido: form.apelido,
        email: form.email,
        senha: form.senha,
        data_nascimento: form.dataNasc
      })
      console.log("User created:", res.data);
      alert("Cadastro realizado!");
      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Erro desconhecido";
        alert(`Erro: ${errorMessage}`);
      } else {
        alert("Erro ao registrar");
      }
      console.error("Erro ao criar usuário", error);
      throw error;
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/user/login", {
        email: form.email,
        senha: form.senha
      })
      alert("Usuario logado!");
      return res.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  }

  return (
    <div className="flex min-h-screen bg-primary">

      <div className="w-full flex justify-center m-30 rounded-3xl">
        {/* lado esquerdo do form */}
        <div className="flex flex-col md:flex w-1/2 bg-tertiary justify-center items-center rounded-tl-[20px] rounded-bl-[20px]">
          <LogoPrimary size={300} />
          <p className="text-2xl text-center mt-2">Já tem uma conta?</p>
          <Button className="w-[50%] m-3" onClick={() => isLogin ? setIsLogin(false) : setIsLogin(true)}>{isLogin ? "Fazer Cadastro" : "Fazer Login"}</Button>
        </div>

        {/* lado direito do form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-7 rounded-tr-[20px] rounded-br-[20px]">
          <div className="w-full max-w-md">

            <h2 className="text-2xl font-semibold text-textPrimary mb-4">
              Faça seu cadastro:
            </h2>

            <form onSubmit={handleSubmit} className="space-y-2">
              {!isLogin && (
                <InputField
                  label="Nome"
                  name="nome"
                  type="text"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              )}

              {!isLogin && (
                <InputField
                  label="Apelido"
                  name="apelido"
                  type="text"
                  value={form.apelido}
                  onChange={handleChange}
                  required
                />
              )}

              {!isLogin && (
                <InputField
                  label="Data de nascimento"
                  name="dataNasc"
                  type="date"
                  value={form.dataNasc}
                  onChange={handleChange}
                  required
                />
              )}

              <InputField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <InputField
                label="Senha"
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                required
              />

              {!isLogin && (
                <InputField
                  label="Confirmar senha"
                  name="confirmaSenha"
                  type="password"
                  value={form.confirmaSenha}
                  onChange={handleChange}
                  required
                />
              )}

              {isLogin && (
                <div className="text-sm text-secondary hover:underline cursor-pointer">
                  Esqueceu a senha?
                </div>
              )}


              <Button type="submit" className="w-full">{isLogin ? "Login" : "Cadastrar"}</Button>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
