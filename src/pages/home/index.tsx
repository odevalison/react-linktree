import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import {
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

import { type LinkProps } from "../admin";
import { Social } from "../../components/social";
import { db } from "../../services/firebaseConnection";

interface SocialLinksProps {
  facebook: string;
  instagram: string;
  youtube: string;
}

export function Home() {
  const [savedLinks, setSavedLinks] = useState<LinkProps[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>();

  useEffect(() => {
    async function loadLinks() {
      const linksRef = collection(db, "links");
      const queryRef = query(linksRef, orderBy("createdAt", "asc"));

      try {
        const snapshot = await getDocs(queryRef);
        const linksList = [] as LinkProps[];

        snapshot.forEach((doc) => {
          linksList.push({
            id: doc.id,
            name: doc.data().name,
            url: doc.data().url,
            bgColor: doc.data().bgColor,
            textColor: doc.data().textColor,
          });

          setSavedLinks(linksList);
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(`ERRO: ${err.message}`);
        }

        console.error(`ERRO DESCONHECIDO: ${err}`);
      }
    }

    loadLinks();
  }, []);

  useEffect(() => {
    async function loadSocialLinks() {
      const docRef = doc(db, "social", "link");

      try {
        const snapshot = await getDoc(docRef);

        if (snapshot.data() === undefined) {
          return;
        }

        setSocialLinks({
          facebook: snapshot.data()?.facebook,
          instagram: snapshot.data()?.instagram,
          youtube: snapshot.data()?.youtube,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(`ERRO: ${err.message}}`);
        }

        console.error(`ERRO DESCONHECIDO: ${err}`);
      }
    }

    loadSocialLinks();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full py-4">
      <h1 className="md:text-4xl text-3xl font-bold text-white mt-20">
        Dev Alison
      </h1>

      <span className="text-gray-50 mb-5 mt-3">Conheça meus links 👇</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        {savedLinks.map((link) => (
          <section
            key={link.id}
            className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: link.bgColor }}
          >
            <a href={link.url} target="_blank">
              <p
                className="md:text-lg text-base"
                style={{ color: link.textColor }}
              >
                {link.name}
              </p>
            </a>
          </section>
        ))}

        {socialLinks && Object.keys(socialLinks).length > 0 && (
          <footer className="flex justify-center gap-3 my-4">
            <Social url={socialLinks.youtube}>
              <FaYoutube size={35} color="#fff" />
            </Social>
            <Social url={socialLinks.facebook}>
              <FaFacebook size={35} color="#fff" />
            </Social>
            <Social url={socialLinks.instagram}>
              <FaInstagram size={35} color="#fff" />
            </Social>
          </footer>
        )}
      </main>
    </div>
  );
}
