import { useIsAuthenticated } from "../../hooks/authHook";
import { Navigate, Outlet } from "react-router-dom";
import AppLayout from "../AppLayout";

const AuthenticatedLayout = () => {
  const { authenticated, user, message, loading } = useIsAuthenticated();

  if (!authenticated && !loading) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default AuthenticatedLayout;