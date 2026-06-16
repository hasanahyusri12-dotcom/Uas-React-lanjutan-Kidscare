import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, kata_sandi) => {
    try {
      const respon = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        kata_sandi,
      });
      if (respon.data.success) {
        setUser(respon.data.user);
        return respon.data;
      }
    } catch (error) {
      throw error.response?.data?.message || "Terjadi kesalahan saat login";
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
      setUser(null);
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const cekStatusLogin = async () => {
      try {
        const respon = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
        if (respon.data.success && isMounted) {
          setUser(respon.data.user);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    cekStatusLogin();
    return () => { isMounted = false; };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;