import Cookies from "js-cookie";

export const setTokens = (accessToken: string, refreshToken: string) => {
  // ✅ cookie for middleware
  Cookies.set("accessToken", accessToken);

  // ✅ refresh token in local storage
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => {
  return Cookies.get("accessToken") || null;
};

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const clearTokens = () => {
  Cookies.remove("accessToken");
  localStorage.removeItem("refreshToken");
};
