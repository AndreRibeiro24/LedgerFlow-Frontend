import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem("authUser");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "Invalid stored user data:",
        error
      );

      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");

      return null;
    }
  });

  const [loading, setLoading] =
    useState(false);

  const login = async (body) => {
    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        body
      );

      if (response.status === 200) {
        setUser(response.data.user);

        localStorage.setItem(
          "authToken",
          response.data.token
        );

        localStorage.setItem(
          "authUser",
          JSON.stringify(
            response.data.user
          )
        );

        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response || error
      );
    } finally {
      setLoading(false);
    }
  };

const register = async (body) => {
  try {
    setLoading(true);

    const response = await api.post(
      "/auth/register",
      body
    );

    if (response.status === 201) {
      navigate("/login", {
        replace: true,
      });

      return {
        success: true,
      };
    }

    return {
      success: false,
      message: "Unable to create account.",
    };
  } catch (error) {
    console.error(
      "Register error:",
      error.response || error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Unable to create account. Please try again.",
    };
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    localStorage.removeItem(
      "authToken"
    );

    localStorage.removeItem(
      "authUser"
    );

    setUser(null);

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}