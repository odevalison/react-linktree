import { Social } from "../../components/social";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-4">
      <h1 className="md:text-4xl text-3xl font-bold text-white mt-20">
        Alison Dev
      </h1>

      <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        <section className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer">
          <a>
            <p className="md:text-lg text-base">Canal no Youtube</p>
          </a>
        </section>

        <footer className="flex justify-center gap-3 my-4">
          <Social url="https://youtube.com/sujeitoprogramador">
            <FaYoutube size={35} color="#fff" />
          </Social>
          <Social url="https://facebook.com/sujeitoprogramador">
            <FaFacebook size={35} color="#fff" />
          </Social>
          <Social url="https://instagram.com/sujeitoprogramador">
            <FaInstagram size={35} color="#fff" />
          </Social>
        </footer>
      </main>
    </div>
  );
}
