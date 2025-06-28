import { Link } from "react-router";

export const ErrorPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="font-bold text-6xl mb-2">404</h1>
      <h2 className="font-bold text-4xl mb-4">Página não encontrada</h2>
      <p className="italic mb-4">Voce caiu em uma página que não existe!</p>

      <Link to="/" className="bg-gray-50/2 py-1 px-4 rounded-md">
        Voltar para a home
      </Link>
    </div>
  );
};
