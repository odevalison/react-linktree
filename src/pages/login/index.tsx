import { Link } from "react-router";
import { useState, type FormEvent } from "react";
import { AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";

import { Input } from "../../components/input";
import { auth } from "../../services/firebaseConnection";
import toast, { Toaster } from "react-hot-toast";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (email === "" || password === "") {
      return toast.error("Preencha todos os campos");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/admin", { replace: true });

      return toast.success("Logado com sucesso!");
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes(AuthErrorCodes.INVALID_LOGIN_CREDENTIALS)
      ) {
        return toast.error("E-mail ou senha inválidos");
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} />

      <Link to="/">
        <h1 className="mt-11 text-white mb-7 font-bold text-5xl">
          Dev
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Link
          </span>
        </h1>
      </Link>

      <form
        className="w-full max-w-xl flex flex-col px-2"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Digite seu e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="**********"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="h-9 bg-blue-500 rounded border-0 text-lg font-medium text-white cursor-pointer"
        >
          Acessar
        </button>
      </form>
    </div>
  );
}
