import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getAuthUser, removeAuthUser } from "../services/storage";

import {
  loginUser,
  registerUser,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
} from "../services/authApi";

interface AuthContextType {
  user: LoginResponse | null;
  loading: boolean;

  login: (request: LoginRequest) => Promise<LoginResponse>;

  register: (request: RegisterRequest) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<LoginResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Load saved user when application starts
   */
  const loadUser = useCallback(async () => {
    try {
      const savedUser = await getAuthUser();

      if (savedUser) {
        console.log(
          "SAVED USER FROM STORAGE:",
          JSON.stringify(savedUser, null, 2),
        );

        console.log("SAVED USER ID:", savedUser.userId);

        setUser(savedUser);
      }
    } catch (error) {
      console.error("Failed to load authenticated user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Login
   */
  const login = async (request: LoginRequest): Promise<LoginResponse> => {
    const loggedInUser = await loginUser(request);

    setUser(loggedInUser);

    return loggedInUser;
  };

  /**
   * Register
   */
  const register = async (request: RegisterRequest): Promise<void> => {
    await registerUser(request);
  };

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    await removeAuthUser();

    setUser(null);
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
};

/**
 * Access authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
