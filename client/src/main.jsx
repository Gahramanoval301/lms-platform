import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import AuthProvider from "./context/auth-context";
import InstructorProvider from "./context/instructor-context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InstructorProvider>
          <App />
        </InstructorProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
