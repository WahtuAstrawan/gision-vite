import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProtectedRoutes from "./utils/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/" />
        <Route element={<Register />} path="/register" />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Home />} path="/home" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
