import { useEffect, useState } from "react";
import { AuthContext } from "./authcontext";
import { getAuthCookie } from ".";

const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Load user from storage on app load
    const storedUser = getAuthCookie();
    if (storedUser?.token) {
      setUserDetails(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
