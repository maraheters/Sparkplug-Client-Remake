import Login from "./features/auth/pages/Login";
import CatalogDashboard from "./features/catalog/admin/pages/CatalogDashboard";
import { ClientDashboard } from "./features/client-dashboard/ClientDashboard";
import { useAuth } from "./hooks/AuthContext";

export default function Home() {
    const { userAuth } = useAuth();

    if (!userAuth) {
        return <Login />;
    }

    const isAdmin = userAuth.authorities.some(role => role.startsWith('ADMIN'));
    return isAdmin ? <CatalogDashboard /> : <ClientDashboard />;
}