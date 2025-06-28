import { useEffect, useRef, useState, type FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { MdInsertLink } from "react-icons/md";
import {
  addDoc,
  collection,
  query,
  orderBy,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

import { Input } from "../../components/input";

import { db } from "../../services/firebaseConnection";
import { Button } from "../../components/button";

// TODO: Criar funcionalidade de modal para editar os links (url, nome e cor).
// TODO: Criar component de PickColorsInput

export interface LinkProps {
  id: string;
  name: string;
  url: string;
  bgColor: string;
  textColor: string;
}

export function Admin() {
  // config vars
  const defaultBgColor = "#121212";
  const defaultTextColor = "#f1f1f1";

  // refs
  const linkUrlRef = useRef<HTMLInputElement>(null);

  // states
  const [linkBgColor, setLinkBgColor] = useState(defaultBgColor);
  const [linkTextColor, setLinkTextColor] = useState(defaultTextColor);
  const [linkName, setLinkName] = useState("");
  const [myLinks, setMyLinks] = useState<LinkProps[]>([]);

  useEffect(() => {
    async function loadMyLinks() {
      const linksRef = collection(db, "links");
      const queryRef = query(linksRef, orderBy("createdAt", "asc"));

      try {
        const snapshot = await getDocs(queryRef);
        const myLinksList = [] as LinkProps[];

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
      } catch (err: unknown) {
        if (err instanceof Error) {
          return toast.error("Erro ao buscar links");
        }

        return toast.error(
          "Erro inesperado, recarregue a página e tente novamente"
        );
      }
    }

    loadMyLinks();
  }, []);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (!linkName || !linkUrlRef.current?.value) {
      return toast.error("Preencha todos os campos");
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
  }

  async function handleDeleteLink(linkId: string) {
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
  }

  return (
    <div className="h-screen flex flex-col items-center pb-7 px-3">
      <Toaster position="top-right" reverseOrder={false} />

      <form
        className="w-full max-w-xl flex flex-col mt-8 mb-3"
        onSubmit={handleRegister}
      >
        <label className="text-white font-medium mt-2 mb-1">Nome do link</label>
        <Input
          placeholder="Digite o nome do link"
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
        />
        <label className="text-white font-medium mt-2 mb-1">URL do link</label>
        <Input placeholder="Digite a URL do link" type="url" ref={linkUrlRef} />
        <section className="flex items-center gap-5 my-5">
          <div className="flex items-center gap-3">
            <label className="text-white font-medium">Cor de fundo</label>

            <input
              type="color"
              value={linkBgColor}
              onChange={(e) => setLinkBgColor(e.target.value)}
              className="appearance-none cursor-pointer border-0 h-10 w-14 rounded px-[1px] bg-[#D9D9D9] color-swatch-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-white font-medium">Cor do texto</label>

            <input
              type="color"
              value={linkTextColor}
              onChange={(e) => setLinkTextColor(e.target.value)}
              className="appearence-none border-0 h-10 w-14 rounded px-[1px] bg-[#D9D9D9] color-swatch-sm"
            />
          </div>
        </section>
        {linkName && (
          <div className="flex flex-col items-center justify-center mb-7 p-1 border-gray-100/25 border rounded-md px-3">
            <label className="text-white font-medium mt-2 mb-3">
              Veja como está ficando:
            </label>

            <article
              className="w-full max-w-xl flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
              style={{ marginBlock: 8, backgroundColor: linkBgColor }}
            >
              <p className="font-medium" style={{ color: linkTextColor }}>
                {linkName}
              </p>
            </article>
          </div>
        )}
        <Button type="submit">
          Cadastrar <MdInsertLink size={24} color="#fff" />
        </Button>
      </form>

      {myLinks.length > 0 && (
        <h2 className="font-bold text-white mb-4 text-2xl">Meus Links</h2>
      )}

      {myLinks.map((link) => (
        <article
          className="w-full max-w-2xl flex items-center justify-between rounded py-2 px-3 mb-2 select-none"
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
}
