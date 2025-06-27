import { Link } from "react-router";
import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";

import { Input } from "../../components/input";
import { auth } from "../../services/firebaseConnection";

// TODO: Implementar ReactToastify para exibir toasts de sucesso e erro.
// TODO: Melhorar os tratamentos de erro das funcoes assincronas.

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log({ error: err, errorMessage: err.message });
      }
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
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
