import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/AuthContext";
import { Role } from "@/api/auth";

interface ProtectedRouteProps {
    roles?: Role[];
  }
  
const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
    const { isLoggedIn, userAuth } = useAuth();

    if (!isLoggedIn()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.some(role => userAuth?.authorities.includes(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;