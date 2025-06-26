import { type ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../services/firebaseConnection";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps) {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user?.uid,
          email: user?.email,
        };

        localStorage.setItem("@ReactDevLinks", JSON.stringify(userData));

        setSigned(true);
        setLoading(false);
      } else {
        setLoading(false);
        setSigned(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    // TODO Pesquisar e implementar um loading aqui.
    return <></>;
  } else if (!signed) {
    // TODO Implementar Toastify de erro aqui.
    return <Navigate to="/login" />;
  }

  return children;
}
