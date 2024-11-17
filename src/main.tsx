import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { HotelProvider } from "./contexts/HoltelContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Router>
    <AuthProvider>
      <HotelProvider>
        <App />
      </HotelProvider>
    </AuthProvider>
    <ToastContainer position="bottom-center" />
  </Router>
  // </StrictMode>
);
