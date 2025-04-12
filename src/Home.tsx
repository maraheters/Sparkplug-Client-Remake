import Login from "./features/auth/pages/Login";
import CatalogDashboard from "./features/catalog/admin/pages/CatalogDashboard";
import { useAuth } from "./hooks/AuthContext";

export default function Home() {
    const { userAuth } = useAuth();

    if (!userAuth) {
        return <Login />;
    }

    const isAdmin = userAuth.authorities.some(role => role.startsWith('ADMIN'));
    return isAdmin ? <CatalogDashboard /> : <div>client dash</div>;
}