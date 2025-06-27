import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router";
import { signOut } from "firebase/auth";

import { auth } from "../../services/firebaseConnection";

// TODO: Melhorar tratamento de erros da funcao de logout

export function Header() {
  async function handleLogOut() {
    try {
      await signOut(auth);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error({ error: err, errorMessage: err.message });
      }
    }
  }

  return (
    <header className="w-full my-0 mx-auto max-w-2xl mt-4 px-1">
      <nav className="w-full bg-white h-12 flex items-center gap-6 rounded-md px-3">
        <button onClick={handleLogOut}>
          <BiLogOut size={30} color="#db2629" className="cursor-pointer" />
        </button>

        <div className="flex gap-4 font-medium">
          <Link to="/">Home</Link>
          <Link to="/admin">Links</Link>
          <Link to="/admin/social">Redes sociais</Link>
        </div>
      </nav>
    </header>
  );
}
