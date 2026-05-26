import { useContext } from "react";
import { GoruAuthContext } from "../context/GoruAuthContext";

const userGoruAuth = () => {
  const context = useContext(GoruAuthContext);

  if (!context) {
    throw new Error("useGoruAuth must be used inside GoruAuthProvider");
  }

  return context;
};

export default userGoruAuth;
