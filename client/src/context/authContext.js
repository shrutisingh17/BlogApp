import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  // first check local storage if there is a user inside local storage we're gonna use it, if there is no user it means we're not logged in
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null //everything in local storage is string so coverting to object
  );

  const [loggedIn, setLoggedIn] = useState(Boolean(currentUser));

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setCurrentUser(res.data);
    setLoggedIn(true);
  };

  const logout = async (inputs) => {
    await axios.post("http://localhost:8800/api/auth/logout", null, {
      withCredentials: true,
    });
    setCurrentUser(null);
    setLoggedIn(false);
  };

  //whenever we change current user, we're gonna update our local storage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
