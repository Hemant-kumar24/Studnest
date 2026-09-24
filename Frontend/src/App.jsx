import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return <AuthProvider><BrowserRouter><Toaster position="bottom-right" /><AppRoutes /></BrowserRouter></AuthProvider>;
}
