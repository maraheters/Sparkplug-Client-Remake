import { AuthResponse, Role, UserAuth } from "@/api/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router"
import { 
    login as loginApi, 
    registerEmail as registerEmailApi,
    registerPhoneNumber as registerPhoneNumberApi
} from "@/api/auth"

type JwtPayload = {
    id: number;
    username: string;
    email?: string;
    phoneNumber?: string;
    authorities: string[];
    // other fields like `sub`, `iat`, `exp` can be included if needed
};

type UserContextType = {
    userAuth: UserAuth | null;
    register: (username: string, identifier: string, password: string) => void;
    login: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

type Props = { children: React.ReactNode };

export const AuthProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [userAuth, setUserAuth] = useState<UserAuth | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("userAuth");
        if (user) {
            setUserAuth(JSON.parse(user));
        }

        setIsReady(true);
    }, []);

    const register = async (username: string, identifier: string, password: string) => {
        try {
            let response;
            if (identifier.includes('@')) {
                response = await registerEmailApi(username, identifier, password);
            } else {
                response = await registerPhoneNumberApi(username, identifier, password);
            }
            parseResponseAndSetAuth(response);
            navigate("/");
        } catch (error) {
            console.error("Failed to register:", error);
        }
    };

    const login = async (username: string, password: string) => {
        try{
            const response = await loginApi(username, password);
            parseResponseAndSetAuth(response);
            navigate("/");
        } catch (error) {
            console.error(error)
        }
    }; 

    const logout = () => {
        localStorage.clear();
        setUserAuth(null);
        navigate("/login");
        location.reload();
    }

    const isLoggedIn = () => {
        return !!userAuth;
    }

    const parseResponseAndSetAuth = (response: AuthResponse) => {
        const userAuth = decodeJwt(response.token);
        setUserAuth(userAuth);
        localStorage.setItem("userAuth", JSON.stringify(userAuth));
    }

    const decodeJwt = (jwt: string): UserAuth => {

        const decoded: JwtPayload = jwtDecode(jwt);

        console.log("decoded:", decoded)

        return {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email || "",
            phoneNumber: decoded.phoneNumber || "",
            authorities: decoded.authorities.map(a => Role[a as keyof typeof Role ]),
            token: jwt
        };
    }

    return (
        <UserContext.Provider 
            value={{ 
                userAuth, 
                register,
                login, 
                logout, 
                isLoggedIn 
            }}
        >
            {isReady ? children : <p>Loading...</p>}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);