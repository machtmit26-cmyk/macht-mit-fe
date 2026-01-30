import Cookies from "js-cookie";

const AUTH_KEY = "auth_user";

export const setAuthCookie = (data) => {
  Cookies.set(AUTH_KEY, JSON.stringify(data), {
    expires: 1, 
    secure: true,
    sameSite: "strict",
  });
};

export const getAuthCookie = () => {
  const data = Cookies.get(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

export const removeAuthCookie = () => {
  Cookies.remove(AUTH_KEY);
};

export const isAuthenticated = () => {
  return !!Cookies.get(AUTH_KEY);
};
