import React, {
  ReactNode,
} from "react";

import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { OrderProvider } from "./OrderContext";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({
  children,
}: AppProviderProps) => {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
};