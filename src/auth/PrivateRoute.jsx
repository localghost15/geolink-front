import { Navigate } from "react-router-dom"
import { authService } from "../services/authServices"

export const PrivateRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/login" />;
  };