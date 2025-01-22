import { lazy } from "react";
import { Route, Routes } from "react-router-dom"
import AppRoutes from "./AppRoutes";

const AuthenticatedLayout = lazy(() => import("../layouts/Auth/AuthenticatedLayout"));
const GuestLayout = lazy(() => import("../layouts/Auth/GuestLayout"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Registration = lazy(() => import("../pages/Auth/Registration"));


const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthenticatedLayout/>}>
        {AppRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route element={<GuestLayout/>}>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Registration/>} />
      </Route>
      <Route path="/403" element={null} />
      <Route path="*" element={null} />
    </Routes>
  )
}

export default Router;