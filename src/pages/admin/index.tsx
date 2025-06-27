import { useEffect, useState, type FormEvent } from "react";
import { FiLink, FiTrash } from "react-icons/fi";
import { MdInsertLink } from "react-icons/md";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { Input } from "../../components/input";

import { db } from "../../services/firebaseConnection";

// TODO: Criar funcionalidade de modal para editar os links (url, nome e cor).
// TODO: Melhorar os tratamentos de erros das buscas no banco.
// TODO: Implementar ReactToastify para exibir toasts de link sucesso e erro.

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bgColor: string;
  textColor: string;
}

export function Admin() {
  const defaultBg = "#121212";
  const defaultTextColor = "#f1f1f1";

  const [linkBgColor, setLinkBgColor] = useState(defaultBg);
  const [linkTextColor, setLinkTextColor] = useState(defaultTextColor);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [myLinks, setMyLinks] = useState<LinkProps[]>([]);

  useEffect(() => {
    const linksRef = collection(db, "links");
    const queryRef = query(linksRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const list = [] as LinkProps[];

      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bgColor: doc.data().bgColor,
          textColor: doc.data().textColor,
        });
      });

      setMyLinks(list);
    });

    return () => unsubscribe();
  });

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (!linkName || !linkUrl) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await addDoc(collection(db, "links"), {
        name: linkName,
        url: linkUrl,
        bgColor: linkBgColor,
        textColor: linkTextColor,
        createdAt: new Date(),
      });

      setLinkName("");
      setLinkUrl("");
      setLinkBgColor(defaultBg);
      setLinkTextColor(defaultTextColor);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`ERRO: ${err.message}`);
        return;
      }

      console.error(`ERRO INESPERADO: ${err}`);
    }
  }

  async function handleDeleteLink(linkId: string) {
    const docRef = doc(db, "links", linkId);

    try {
      await deleteDoc(docRef);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`ERRO: ${err.message}`);
      }

      console.log(`ERRO INESPERADO: ${err}`);
    }
  }

  return (
    <div className="h-screen flex flex-col items-center pb-7 px-2">
      <form
        className="w-full max-w-xl flex flex-col mt-8 mb-3"
        onSubmit={handleRegister}
      >
        <label className="text-white font-medium my-2">Nome do link</label>
        <Input
          placeholder="Digite o nome do link"
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
        />

        <label className="text-white font-medium my-2">URL do link</label>
        <Input
          placeholder="Digite a URL do link"
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
        />

        <section className="flex items-center gap-5 my-5 not-md:justify-center">
          <div className="flex items-center gap-3">
            <label className="text-white font-medium my-2">Fundo do link</label>

            <input
              type="color"
              value={linkBgColor}
              onChange={(e) => setLinkBgColor(e.target.value)}
              className="border-0 h-10 w-10 rounded-4xl px-[1px] bg-[#D9D9D9] color-swatch-4xl"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-white font-medium my-2">Cor do link</label>

            <input
              type="color"
              value={linkTextColor}
              onChange={(e) => setLinkTextColor(e.target.value)}
              className="border-0 h-10 w-10 rounded-4xl px-[1px] bg-[#D9D9D9] color-swatch-4xl"
            />
          </div>
        </section>

        {linkName && (
          <div className="flex flex-col items-center justify-center mb-7 p-1 border-gray-100/25 border rounded-md">
            <label className="text-white font-medium mt-2 mb-3">
              Veja como está ficando:
            </label>

            <article
              className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
              style={{ marginBlock: 8, backgroundColor: linkBgColor }}
            >
              <p className="font-medium" style={{ color: linkTextColor }}>
                {linkName}
              </p>
            </article>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 h-9 rounded-md text-white font-medium gap-2 flex items-center justify-center mb-7 cursor-pointer"
        >
          Cadastrar <MdInsertLink size={24} color="#fff" />
        </button>
      </form>

      {myLinks.length > 0 && (
        <h2 className="font-bold text-white mb-4 text-2xl">Meus Links</h2>
      )}

      {myLinks.map((link) => (
        <article
          className="flex items-center justify-between w-full max-w-xl rounded py-2 px-3 mb-2 select-none"
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
