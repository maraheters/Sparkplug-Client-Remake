import { UserAuth } from "@/api/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router"
import { 
    login as loginApi, 
    registerEmail as registerEmailApi,
    registerPhoneNumber as registerPhoneNumberApi
} from "@/api/auth"

type UserContextType = {
    userAuth: UserAuth | null;
    registerEmail: (formData: any) => void;
    registerPhoneNumber: (formData: any) => void;
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

    const registerEmail = async (formData: any) => {
        try{
            const { username, email, password } = formData;
            const response = await registerEmailApi(username, email, password);
            setUserAuth(response);
            localStorage.setItem("userAuth", JSON.stringify(response));
            navigate("/");
        } catch (error) {
            console.error("Failded to register:", error);
        }
    };   

    const registerPhoneNumber = async (formData: any) => {
        try{
            const { username, phoneNumber, password } = formData;
            const response = await registerPhoneNumberApi(username, phoneNumber, password);
            setUserAuth(response);
            localStorage.setItem("userAuth", JSON.stringify(response));
            navigate("/");
        } catch (error) {
            console.error("Failded to register:", error);
        }
    };   

    const login = async (username: string, password: string) => {
        try{
            const response = await loginApi(username, password);
            setUserAuth(response);
            localStorage.setItem("userAuth", JSON.stringify(response));
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

    return (
        <UserContext.Provider 
            value={{ 
                userAuth, 
                registerEmail,  
                registerPhoneNumber, 
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