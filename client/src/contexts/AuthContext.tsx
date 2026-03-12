import React, { createContext, useContext, useEffect, ReactNode, useState } from "react";
import type { User } from "../types/auth.types";
import { authService } from "../services/auth.service";


// Contract for everything exposed by AuthContext.
// Any component calling useAuth() gets this shape.
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoadingUser: boolean;  // true while at starup. 
}



export const AuthContext = createContext<AuthContextType | null>(null);

export const  AuthProvider = ({ children }: {children: ReactNode}) =>  {

  const [user, setUser] = useState<User | null>(null);

  // true: still checking the user is logged in 

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  // on every page reload/refresh try to restore the session. 
  // 1. load the token from localstorage back into axios headers. 
  // 2. call the getMe service with that token. 
  // 3. if valid backend returns the users and set into state. 
  // 4. if invalid/expired: 401 from that axios logic. 

  useEffect (() => {
    const restoreSession = async () => {
      authService.loadTokenFromStorage(); // re-attach  token from axis headers.
      try {
        const user  = await authService.getMe();
        setUser(user);
      }catch {
        setUser(null);
      }finally {
        setIsLoadingUser(false);
      }
    };

    restoreSession();

  }, []); // runs once on app startup. 


  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated: !!user, isLoadingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
