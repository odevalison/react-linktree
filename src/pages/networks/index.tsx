import { useEffect, useState, type FormEvent } from "react";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { MdInsertLink } from "react-icons/md";

import { Input } from "../../components/input";

import { db } from "../../services/firebaseConnection";
import toast, { Toaster } from "react-hot-toast";
import { Header } from "../../components/header";

// TODO Melhorar tratamento de erro da funcao assincrona
// TODO Revisar funcoes firebase (addDoc, setDoc, etc...)
// TODO Implementar sistema de adicionar novas redes sociais (admin)
// TODO Criar component button

export const Networks = () => {
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    const loadLinks = async () => {
      const docRef = doc(db, "social", "link");

      try {
        const snapshot = await getDoc(docRef);

        // se nao tiver nada, para a execucao da funcao.
        if (snapshot.data() === undefined) {
          return;
        }

        setFacebookUrl(snapshot.data()?.facebook);
        setInstagramUrl(snapshot.data()?.instagram);
        setYoutubeUrl(snapshot.data()?.youtube);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(`ERRO: ${err.message}`);
        }

        console.error(`ERRO INESPERADO: ${err}`);
      }
    };

    loadLinks();
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, "social", "link"), {
        facebook: facebookUrl,
        instagram: instagramUrl,
        youtube: youtubeUrl,
      });

      return toast.success("Link salvo com sucesso!");
    } catch (err) {
      if (err instanceof Error) {
        return toast.error("Erro ao salvar link social, tente novamente");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-7 px-2">
      <Toaster position="top-right" reverseOrder={false} />

      <Header />

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
          className="max-w-[600px] h-9 text-white bg-blue-600 rounded-md flex items-center justify-center gap-[7px] mb-7 font-medium cursor-pointer"
        >
          Salvar links
          <MdInsertLink size={24} color="#fff" />
        </button>
      </form>
    </div>
  );
};
