import { useState, type FormEvent } from "react";
import { setDoc, addDoc, getDoc, doc } from "firebase/firestore";
import { MdInsertLink } from "react-icons/md";

import { Input } from "../../components/input";

import { db } from "../../services/firebaseConnection";

// TODO Melhorar tratamento de erro da funcao assincrona
// TODO Revisar funcoes firebase (addDoc, setDoc, etc...)
// TODO Implementar sistema de adicionar novas redes sociais (admin)

export function Networks() {
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      await setDoc(doc(db, "social", "link"), {
        facebook: facebookUrl,
        instagram: instagramUrl,
        youtube: youtubeUrl,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(`ERRO: ${err.message}`);
        return;
      }

      console.log(`ERRO INESPERADO: ${err}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center pb-7 px-2">
      <h1 className="text-white text-2xl font-semibold mt-8 mb-4">
        Suas redes sociais
      </h1>

      <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
        <label className="text-white font-medium mt-2 mb-1">
          Link Facebook
        </label>
        <Input
          type="url"
          placeholder="Digite a url do Facebook"
          value={facebookUrl}
          onChange={(e) => setFacebookUrl(e.target.value)}
        />

        <label className="text-white font-medium mt-2 mb-1">
          Link Instagram
        </label>
        <Input
          type="url"
          placeholder="Digite a url do Instagram"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
        />

        <label className="text-white font-medium mt-2 mb-1">Link YouTube</label>
        <Input
          type="url"
          placeholder="Digite a url do YouTube"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />

        <button
          type="submit"
          className="text-white bg-blue-600 h-9 rounded-md flex items-center justify-center gap-2 mb-7 font-medium cursor-pointer"
        >
          Salvar links
          <MdInsertLink size={24} color="#fff" />
        </button>
      </form>
    </div>
  );
}
