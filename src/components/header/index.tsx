import { Link, useNavigate } from "react-router";
import { signOut } from "firebase/auth";

import { auth } from "../../services/firebaseConnection";
import { BiLogOut } from "react-icons/bi";

// TODO: Melhorar tratamento de erros da funcao de logout

export const Header = () => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      return navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error({ error: err, errorMessage: err.message });
      }
    }
  };

  return (
    <header className="w-2xl max-w-full bg-white h-12 rounded mx-auto mt-4 px-4 flex items-center">
      <nav className="w-full flex items-center gap-6">
        <button
          onClick={handleLogOut}
          className="flex items-center gap-2 font-medium cursor-pointer"
        >
          <BiLogOut size={24} color="#db2629" className="cursor-pointer" />
        </button>

        <div className="flex items-center gap-4 font-medium">
          <Link to="/">Home</Link>
          <Link to="/admin">Links</Link>
          <Link to="/admin/social">Redes sociais</Link>
        </div>
      </nav>
    </header>
  );
};
