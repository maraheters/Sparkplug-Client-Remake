import { create } from "@/api/catalog/manufacturers";
import CustomForm from "@/components/custom/CustomForm";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";


export default function ManufacturerCreateForm() {

    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [country, setCountry] = useState<string>("");

    const setDefaultStates = () => {
        setName("");
        setCountry("");
        setError("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedCountry = country.trim();

        if (!trimmedName || !trimmedCountry) {
            setError("Name and country are required.");
            return;
        }

        const request = {
            name: trimmedName,
            country: trimmedCountry
        }

        try {
            await create(request);
            setDefaultStates();
        } catch (err) {
            setError("Failed to create manufacturer.");
            console.error(err);
        }
    };

    return(
    <>
        <CustomForm title="Manufacturer info" onSubmit={handleSubmit} error={error} submitLabel="Submit">
            <div>
                <Label>Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Model name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="country">Country</Label>
                <Input
                    id="country"
                    type="text"
                    placeholder="Manufacturer country..."
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
            </div>
        </CustomForm>
    </>);
}