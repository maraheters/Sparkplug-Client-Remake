import { create } from "@/api/catalog/carModels";
import { getAll, Manufacturer } from "@/api/catalog/manufacturers";
import CustomForm from "@/components/custom/CustomForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function CarModelCreateForm() {

    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [manufacturerId, setManufacturerId] = useState<number>();
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await getAll();
                setManufacturers(response);
            } catch (err) {
                setError("Failed to fetch manufacturers.");
            }
        };

        fetchManufacturers();
    }, []);

    const setDefaultStates = () => {
        setName("");
        setManufacturerId(undefined);
        setError("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedId = manufacturerId;

        if (!trimmedName || !trimmedId) {
            setError("Name and manufacture id are required.");
            return;
        }

        const request = {
            name: trimmedName,
            manufacturerId: trimmedId
        }

        try {
            await create(request);
            setDefaultStates();
        } catch (err) {
            setError("Failed to create car model.");
            console.error(err);
        }
    };

    return(
    <>
        <CustomForm title="Car model info" onSubmit={handleSubmit} error={error} submitLabel="Submit">
            <div>
                <Label>Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Car model name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
                <Select onValueChange={(value) => setManufacturerId(Number(value))} required>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a manufacturer..." />
                    </SelectTrigger>
                    <SelectContent>
                        {manufacturers.map((manufacturer) => (
                            <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                                {manufacturer.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </CustomForm>
    </>);
}