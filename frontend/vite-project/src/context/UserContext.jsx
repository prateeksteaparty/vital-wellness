import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const INITIAL_USER_DETAILS = {
  name: "",
  gender: "",
  dietPreference: "",
  lifestyle: "",
  allergies: []
};

export const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 👇 THIS IS WHAT YOU LOST
  const [userDetails, setUserDetails] = useState(INITIAL_USER_DETAILS);

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
    setAuthLoading(false);
  }, []);

  const resetUserDetails = () => {
    setUserDetails(INITIAL_USER_DETAILS);
  };

  return (
    <UserContext.Provider
      value={{
        auth,
        setAuth,
        authLoading,
        userDetails,
        setUserDetails,
        resetUserDetails
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
