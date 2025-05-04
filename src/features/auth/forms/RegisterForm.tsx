import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomForm from "@/components/custom/CustomForm";
import { useAuth } from "@/hooks/AuthContext";
import { Link } from "react-router";

export default function RegisterForm() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { register } = useAuth();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPhoneNumber = phoneNumber.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
            setError("Username and password are required.");
            return;
        }

        if (!trimmedEmail && !trimmedPhoneNumber) {
            setError("Either email or phone number is required.");
            return;
        }

        if (trimmedEmail) {
            register(trimmedUsername, trimmedEmail, trimmedPassword);
        } else {
            register(trimmedUsername, trimmedPhoneNumber, trimmedPassword);
        }
    };

    return (
        <CustomForm title="Register" onSubmit={handleSubmit} error={error} submitLabel="Register">
            <div>
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="text-sm text-center mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                    Login here
                </Link>
            </div>
        </CustomForm>
    );
} 