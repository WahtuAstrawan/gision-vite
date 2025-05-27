import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const ProtectedRoutes = () => {
  const { token } = useAuthStore();
  const valid = token && token !== "invalid";

  return valid ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
