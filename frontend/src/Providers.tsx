import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const Providers = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default Providers;
