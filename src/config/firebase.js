// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyC50NxkhO-cOqs0j_t8yQvuKHthR1BUGxU",
  authDomain: "chat-app-gs-32913.firebaseapp.com",
  projectId: "chat-app-gs-32913",
  storageBucket: "chat-app-gs-32913.appspot.com",
  messagingSenderId: "27672007470",
  appId: "1:27672007470:web:f7d9342ec7826c30b220bf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign up function
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      name: "",
      avatar: "",
      bio: "Hey, I am chat app",
      lastSeen: Date.now(),
    });
    //  toast.success("Account Create successfully!");
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    });
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

// login function
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    // toast.success("Account Login successfully!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

// logout function
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDoc(q);

    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email send");
    } else {
      toast.error("Email dosn't exists");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};
export { signup, login, logout, auth, db, resetPass };
