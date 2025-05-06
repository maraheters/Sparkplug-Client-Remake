import { Link, Outlet, useNavigate } from "react-router";
import Header from "./Header";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { Role } from "@/api/auth/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const { CLIENT_BASIC, ADMIN_BASIC, ADMIN_MANAGER, ADMIN_GOD } = Role;

export function Layout() {
    const { userAuth, logout } = useAuth();
    const navigate = useNavigate();
    const [links, setLinks] = useState<ReactNode[]>([]);
    const [dropdown, setDropdown] = useState<ReactNode>();

    useEffect(() => {
        if (!userAuth) {
            setDropdown(<Link to={"/login"}>Login</Link>);
            return;
        }

        const authorities = userAuth.authorities;
        var currentLinks: ReactNode[] = [];

        if (authorities.includes(CLIENT_BASIC)) {
            currentLinks.push(<Link to={"/"}>Home</Link>);
            currentLinks.push(<Link to={"/create-listing"}>Create Listing</Link>);
        }

        if (
            authorities.includes(ADMIN_BASIC) ||
            authorities.includes(ADMIN_MANAGER) ||
            authorities.includes(ADMIN_GOD)) {

            currentLinks.push(<Link to={"/"}>Dashboard</Link>);
            currentLinks.push(<Link to={"/catalog"}>Catalog</Link>);
        }

        setLinks(currentLinks);

        // Dropdown menu for profile and logout
        setDropdown(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-4 py-2">
                        {userAuth.username}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logout() }>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }, [userAuth, logout, navigate]);

    return(
        <>
            <Header links={links} rightContent={dropdown}></Header>
            <main className="mx-auto mt-20 ">
                <Outlet />
            </main>
        </>
    );
}