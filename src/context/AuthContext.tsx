import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getAuthUser,
  removeAuthUser,
  saveAuthUser,
} from "../services/storage";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;

  /**
   * True while the application is checking
   * AsyncStorage for an existing session.
   */
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /**
   * Check for an existing login session when
   * the application starts.
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser =
          await getAuthUser();

        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error(
          "Failed to restore session:",
          error
        );
      } finally {
        /**
         * Important:
         *
         * We set loading to false only after
         * AsyncStorage has been checked.
         */
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Mock login.
   *
   * Since this assessment doesn't have a backend,
   * we simply validate that credentials exist and
   * create a local user object.
   */
  const login = useCallback(
    async (
      email: string,
      password: string
    ) => {
      if (!email || !password) {
        throw new Error(
          "Email and password are required."
        );
      }

      /**
       * Simulate a network request.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      const loggedInUser: User = {
        id: `user-${Date.now()}`,
        name: email
          .split("@")[0]
          .replace(/^./, (char) =>
            char.toUpperCase()
          ),
        email,
      };

      setUser(loggedInUser);

      await saveAuthUser(
        loggedInUser
      );
    },
    []
  );

  /**
   * Mock signup.
   */
  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ) => {
      if (
        !name ||
        !email ||
        !password
      ) {
        throw new Error(
          "All fields are required."
        );
      }

      /**
       * Simulate a network request.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
      };

      setUser(newUser);

      await saveAuthUser(newUser);
    },
    []
  );

  /**
   * Logout:
   *
   * 1. Remove persisted session.
   * 2. Clear in-memory user.
   *
   * The navigation guard will then redirect
   * the user to Login.
   */
  const logout = useCallback(
    async () => {
      await removeAuthUser();

      setUser(null);
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  (): AuthContextType => {
    const context =
      useContext(AuthContext);

    if (context === undefined) {
      throw new Error(
        "useAuth must be used inside AuthProvider"
      );
    }

    return context;
  };