import { createContext, ReactNode, useMemo, useState } from "react";

export type UserAuthType = {
  dataNascimento: string; 
  email: string; 
  id: string
  nome: string; 
  sobrenome: string; 
  telefone: string;
  senha: string;
  imagem: string;
}

interface AuthContextProps {
  userAuth: UserAuthType | null;
  handleUserAuth: (value: UserAuthType | null) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userAuth, setUserAuth] = useState<UserAuthType | null>(null);

  function logout() {
    setUserAuth(null);
  }

  function handleUserAuth(value: UserAuthType | null) {
    setUserAuth(value);
  }

  const valuesProvider = useMemo(() => {
    return {
      userAuth,
      handleUserAuth,
      logout,
    }
  }, [userAuth])

  return (
    <AuthContext.Provider
      value={valuesProvider}
    >
      {children}
    </AuthContext.Provider>
  );
}