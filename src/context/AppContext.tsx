import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

type AuthContextProps = {
  user: boolean;
  loadUser: (user: any) => void;
  update: () => void;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AppContext = createContext({} as AuthContextProps);

export const AppProvider = ({ children, }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isUpdated, setIsUpdated] = useState(false);

  function loadUser(user: any) {
    setUser(user);
  }

  function update() {
    setIsUpdated(prevState => !prevState);
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);


  return (
    <AppContext.Provider
      value={{
        user,
        loadUser,
        update,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  return useContext(AppContext);
}