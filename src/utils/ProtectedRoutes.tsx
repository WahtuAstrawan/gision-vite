import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const valid =
    localStorage.getItem("token") &&
    localStorage.getItem("token") !== "invalid";
  return valid ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
