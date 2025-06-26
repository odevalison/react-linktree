import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_iJTnXtQi9qY2jsfsK6rfvWFateKZGOU",
  authDomain: "react-linketree.firebaseapp.com",
  projectId: "react-linketree",
  storageBucket: "react-linketree.firebasestorage.app",
  messagingSenderId: "1079514416690",
  appId: "1:1079514416690:web:97d2b4086b44a3d0e0de2b",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
