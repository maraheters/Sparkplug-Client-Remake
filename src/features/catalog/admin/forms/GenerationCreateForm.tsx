import { create } from "@/api/catalog/generations";
import { getAll as getAllManufacturers, Manufacturer } from "@/api/catalog/manufacturers";
import { getAllByManufacturer, CarModel } from "@/api/catalog/carModels";
import CustomForm from "@/components/custom/CustomForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function GenerationCreateForm() {
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [startYear, setStartYear] = useState<string>("");
    const [manufacturerId, setManufacturerId] = useState<number | null>(null);
    const [carModelId, setCarModelId] = useState<number | null>(null);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [carModels, setCarModels] = useState<CarModel[]>([]);

    useEffect(() => {
        // Fetch manufacturers from the API
        const fetchManufacturers = async () => {
            try {
                const response = await getAllManufacturers();
                setManufacturers(response);
            } catch (err) {
                setError("Failed to fetch manufacturers.");
            }
        };

        fetchManufacturers();
    }, []);

    useEffect(() => {
        // Fetch car models when a manufacturer is selected
        const fetchCarModels = async () => {
            if (!manufacturerId) return;
            try {
                const response = await getAllByManufacturer(manufacturerId);
                console.log(response);
                setCarModels(response);
            } catch (err) {
                setError("Failed to fetch car models.");
                console.error(err);
            }
        };

        fetchCarModels();
    }, [manufacturerId]);

    const setDefaultStates = () => {
        setName("");
        setStartYear("");
        setManufacturerId(null);
        setCarModelId(null);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedStartYear = startYear.trim();

        if (!trimmedName || !trimmedStartYear || !carModelId) {
            setError("All fields are required.");
            return;
        }

        if (carModelId === null) {
            setError("Car model must be selected.");
            return;
        }

        const request = {
            name: trimmedName,
            carModelId: carModelId,
            startYear: Number(startYear)
        };

        try {
            await create(request);
            setDefaultStates();
        } catch (err) {
            setError("Failed to create generation.");
            console.error(err);
        }
    };

    return (
        <>
            <CustomForm title="Generation Info" onSubmit={handleSubmit} error={error} submitLabel="Submit">
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
                <div>
                    <Label htmlFor="carModel">Car Model</Label>
                    <Select
                        onValueChange={(value) => setCarModelId(Number(value))}
                        disabled={!manufacturerId}
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a car model..." />
                        </SelectTrigger>
                        <SelectContent>
                            {carModels.map((carModel) => (
                                <SelectItem key={carModel.id} value={carModel.id.toString()}>
                                    {carModel.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="generationName">Generation Name</Label>
                    <Input
                        id="generationName"
                        type="text"
                        placeholder="Enter generation name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="startYear">Starting year</Label>
                    <Input
                        id="startYear"
                        type="number"
                        min="1886" 
                        placeholder="Enter starting year..."
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                        required
                    />
                </div>
            </CustomForm>
        </>
    );
}