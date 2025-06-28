import { useEffect, useRef, useState, type FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { MdInsertLink } from "react-icons/md";
import {
  addDoc,
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

import { Input } from "../../components/input";

import { db } from "../../services/firebaseConnection";
import { Button } from "../../components/button";
import { ColorPicker } from "../../components/color-picker";
import { Header } from "../../components/header";

// TODO: Criar funcionalidade de modal para editar os links (url, nome e cor).

export interface LinkProps {
  id: string;
  name: string;
  url: string;
  bgColor: string;
  textColor: string;
}

export const Admin = () => {
  const defaultBgColor = "#121212";
  const defaultTextColor = "#f1f1f1";

  const linkUrlRef = useRef<HTMLInputElement>(null);

  const [linkBgColor, setLinkBgColor] = useState(defaultBgColor);
  const [linkTextColor, setLinkTextColor] = useState(defaultTextColor);
  const [linkName, setLinkName] = useState("");
  const [myLinks, setMyLinks] = useState<LinkProps[]>([]);

  useEffect(() => {
    const linksRef = collection(db, "links");
    const queryRef = query(linksRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(queryRef, (snapshot) => {
      const myLinksList: LinkProps[] = [];

      snapshot.forEach((doc) => {
        myLinksList.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bgColor: doc.data().bgColor,
          textColor: doc.data().textColor,
        });
      });

      setMyLinks(myLinksList);
    });

    return () => unsub();
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    // Verificacao dos campos
    if (!linkName && !linkUrlRef.current?.value) {
      return toast.error("Preencha todos os campos");
    } else if (linkName && !linkUrlRef.current?.value) {
      return toast.error("Preencha a URL do link");
    } else if (!linkName && linkUrlRef.current?.value) {
      return toast.error("Preencha o nome do link");
    }

    try {
      await addDoc(collection(db, "links"), {
        name: linkName,
        url: linkUrlRef.current?.value,
        bgColor: linkBgColor,
        textColor: linkTextColor,
        createdAt: new Date(),
      });

      // redefine o valor da ref (valor do input de url)
      if (linkUrlRef.current?.value) {
        linkUrlRef.current.value = "";
      }

      // redefine os valores dos states
      setLinkName("");
      setLinkBgColor(defaultBgColor);
      setLinkTextColor(defaultTextColor);

      return toast.success("Link criado com sucesso!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        return toast.error("Erro ao cadastrar link, tente novamente");
      }

      return toast.error("Erro inesperado, tente novamente");
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    const docRef = doc(db, "links", linkId);

    try {
      await deleteDoc(docRef);
      return toast.success("Link deletado com sucesso!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        return toast.error("Erro ao excluir link, tente novamente");
      }

      return toast.error("Erro inesperado, tente novamente");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center pb-7 px-2">
      <Toaster position="top-right" reverseOrder={false} />

      <Header />

      <form
        className="w-full max-w-xl flex flex-col mt-8 mb-3"
        onSubmit={handleRegister}
      >
        <label className="text-white font-medium mt-2 mb-1">Nome do link</label>
        <Input
          placeholder="Digite o nome do link"
          onChange={(e) => setLinkName(e.target.value)}
          value={linkName}
        />

        <label className="text-white font-medium mt-2 mb-1">URL do link</label>
        <Input type="url" placeholder="Digite a URL do link" ref={linkUrlRef} />

        <section className="flex items-center gap-5 my-5">
          <div className="flex items-center gap-3">
            <label className="text-white font-medium">Cor de fundo</label>

            <ColorPicker
              value={linkBgColor}
              onChange={(e) => setLinkBgColor(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-white font-medium">Cor do texto</label>

            <ColorPicker
              value={linkTextColor}
              onChange={(e) => setLinkTextColor(e.target.value)}
            />
          </div>
        </section>

        {linkName && (
          <div className="flex flex-col items-center justify-center mb-7 p-1 border-gray-100/25 border rounded-md">
            <label className="text-white font-medium my-2">
              Veja como está ficando seu link 👇
            </label>

            <article
              className="w-11/12 max-w-lg flex flex-col items-center justify-between rounded px-1 py-3 my-2"
              style={{ backgroundColor: linkBgColor }}
            >
              <p className="font-medium" style={{ color: linkTextColor }}>
                {linkName}
              </p>
            </article>
          </div>
        )}

        <Button type="submit">
          Cadastrar
          <MdInsertLink size={24} color="#fff" />
        </Button>
      </form>

      <h2 className="font-bold text-white mb-4 text-2xl">Meus Links</h2>

      {myLinks.map((link) => (
        <article
          className="w-11/12 max-w-xl flex items-center justify-between rounded p-3 mb-2 select-none"
          style={{ backgroundColor: link.bgColor, color: link.textColor }}
          key={link.id}
        >
          <p className="font-medium">{link.name}</p>
          <div>
            <button
              className="border border-dashed p-2 rounded cursor-pointer"
              onClick={() => handleDeleteLink(link.id)}
            >
              <FiTrash size={20} color="#fff" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};
