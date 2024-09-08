import { Outlet } from "react-router-dom";
import NotFoundPage from "../pages/404Page";
import { useAuth } from "../context/AuthContext";

const AuthProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) {
    // or you can redirect to a different page and show a message
    return <NotFoundPage />;
  }
  return <Outlet />;
};

export default AuthProtectedRoute;
