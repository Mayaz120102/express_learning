import { createContext, useEffect, useState } from "react";

export const GoruAuthContext = createContext(null);

export const GoruAuthProvider = ({ children }) => {
  const [goruUser, setGoruUser] = useState(null);
  const [goruLoading, setGoruLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("goruUser");
    const storedToken = localStorage.getItem("goruToken");

    if (storedToken && storedToken) {
      setGoruUser(JSON.parse(storedUser));
    }

    setGoruLoading(false);
  }, []);

  const goruLogin = (userData, token) => {
    localStorage.setItem("goruUser", JSON.stringify(userData));
    localStorage.setItem("goruToken", token);

    setGoruUser(userData);
  };

  const goruLogout = () => {
    localStorage.removeItem("goruUser");
    localStorage.removeItem("goruToken");

    setGoruUser(null);
  };

  return (
    <GoruAuthContext.Provider
      value={{
        goruUser,
        goruLoading,
        goruLogin,
        goruLogout,
        isAuthenticated: !!goruUser, // true if user exists
        isSeller: goruUser?.role === "seller",
        isAdmin: goruUser?.role === "admin",
      }}
    >
      {children}
    </GoruAuthContext.Provider>
  );
};
