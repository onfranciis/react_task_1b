import React from "react";
import { AuthContext } from "./authContext";
import { Routes, Route, Navigate } from "react-router-dom";
import SnackBar from "./components/SnackBar";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function renderRoutes(role) {
  switch (role) {
    case "admin":
      return (
        <Routes>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboardPage />}
          ></Route>
        </Routes>
      );
      break;

    case "pending":
      return (
        <Routes>
          <Route path="*" element={<></>}></Route>
          <Route exact path="/admin/login" element={<AdminLoginPage />}></Route>
        </Routes>
      );
      break;

    default:
      return (
        <Routes>
          <Route exact path="/admin/login" element={<AdminLoginPage />}></Route>
          <Route path="*" exact element={<NotFoundPage />}></Route>
        </Routes>
      );
      break;
  }
}

function Main() {
  const { state } = React.useContext(AuthContext);

  return (
    <div className="h-full">
      <div className="flex w-full">
        <div className="w-full">
          <div className="page-wrapper w-full">
            {state.isAuthenticated
              ? renderRoutes(state.role)
              : state.token
              ? renderRoutes("pending")
              : renderRoutes("none")}
          </div>
        </div>
      </div>
      <SnackBar />
    </div>
  );
}

export default Main;
