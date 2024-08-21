import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { FlashProvider } from "./contexts/flash.tsx";
import { LoadingProvider } from "./contexts/loading.tsx";
import { CartProvider } from "./contexts/Cart.tsx";
import { UserProvider } from "./contexts/user.tsx";

axios.defaults.baseURL = "http://localhost:3000";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <FlashProvider>
          <UserProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </UserProvider>
        </FlashProvider>
      </LoadingProvider >
    </BrowserRouter >
  </React.StrictMode >
);