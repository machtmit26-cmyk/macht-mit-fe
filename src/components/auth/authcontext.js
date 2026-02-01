import { createContext } from "react";

export const AuthContext = createContext({
  userDetails: null,
  setUserDetails: () => {},
});
