import { createContext, useEffect, useState } from "react";
import { authSubscribe } from "@junobuild/core";

export const AuthContext = createContext();

export const Auth = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const sub = authSubscribe((user) => setUser(user));

    return () => sub();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      

      {user !== undefined && user !== null ? (
        <div>{children}</div>
      ) : (
        <div>{children}</div>
      )}
    </AuthContext.Provider>
  );
};