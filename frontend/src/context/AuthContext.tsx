import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { useLocalStorage } from "../utils/useLocalStorage";

type SignInForm = {
  email: string;
  password: string;
};

type User = {
  id: number;
  email: string;
};

type AuthState = User & { exp: number }; // exp is in unix timestamp

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<AuthState | null>>; // Optional
  signOut: () => Promise<string | undefined>;
  signIn: (signInForm: SignInForm) => Promise<string | undefined>;
};

const AuthDataContext = createContext<UserContextType | undefined>(undefined);

export const useAuth = (): UserContextType => {
  const context = useContext(AuthDataContext);
  if (!context) {
    throw new Error("useUser must be used within a UserDataProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<AuthState | null>("user", null);
  const isJwtExpired = (unixTime: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = unixTime - currentTime;
    if (timeRemaining <= 0) {
      console.log("The JWT is expired.");
      setUser(null);
      return true;
    } else {
      const hours = Math.floor(timeRemaining / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      console.log(
        `Time remaining before JWT expires: ${hours} hours ${minutes} minutes`
      );
      return false;
    }
  };

  const signOut = async () => {
    const res = await fetch("http://localhost:8080/auth/signout", {
      method: "POST",
    });

    setUser(null);
    if (!res.ok) {
      console.log("Error signing out");
      return (await res.text()) || "Something went wrong";
    }
  };

  const signIn = async (signInForm: SignInForm) => {
    const res = await fetch("http://localhost:8080/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signInForm),
    });

    if (!res.ok) {
      return (await res.text()) || "Something went wrong";
    }

    const data = (await res.json()) as { user: User; exp: number };

    if (data) {
      setUser({
        ...data.user,
        exp: data.exp,
      });
    }
  };

  // { user: User; exp: number }
  useEffect(() => {
    if (!user) return;
    if (isJwtExpired(user.exp)) signOut();
  }, [user]);

  return (
    <AuthDataContext.Provider
      value={{
        user,
        setUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthDataContext.Provider>
  );
};
