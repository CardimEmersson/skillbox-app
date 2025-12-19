import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

export type UserAuthType = {
  dataNascimento: string; 
  email: string; 
  id: number;
  token: string;
  nome: string; 
  sobrenome: string; 
  telefone: string;
  imagem: string;
  bio: string;
}

interface AuthContextProps {
  userAuth: UserAuthType | null;
  handleUserAuth: (value: UserAuthType | null) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext({} as AuthContextProps);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userAuth, setUserAuth] = useState<UserAuthType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storageUser = await AsyncStorage.getItem("@SkillBox:user");

        if (storageUser) {
          setUserAuth(JSON.parse(storageUser));
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  async function logout() {
    await AsyncStorage.removeItem("@SkillBox:user");
    setUserAuth(null);
  }

  async function handleUserAuth(value: UserAuthType | null) {
    setUserAuth(value);
    if (value) {
      await AsyncStorage.setItem("@SkillBox:user", JSON.stringify(value));
    } else {
      await AsyncStorage.removeItem("@SkillBox:user");
    }
  }

  const valuesProvider = useMemo(() => {
    return {
      userAuth,
      handleUserAuth,
      logout,
      isLoading,
    }
  }, [userAuth, isLoading])

  return (
    <AuthContext.Provider
      value={valuesProvider}
    >
      {children}
    </AuthContext.Provider>
  );
}