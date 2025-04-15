import { create, ModificationCreateRequest } from "@/api/catalog/modifications";
import { getAll as getAllManufacturers, Manufacturer } from "@/api/catalog/manufacturers";
import { getAllByManufacturer, CarModel } from "@/api/catalog/carModels";
import { getAllByCarModel, Generation } from "@/api/catalog/generations";
import CustomForm from "@/components/custom/CustomForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function ModificationCreateForm() {
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [manufacturerId, setManufacturerId] = useState<number | null>(null);
    const [carModelId, setCarModelId] = useState<number | null>(null);
    const [generationId, setGenerationId] = useState<number | null>(null);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [carModels, setCarModels] = useState<CarModel[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [drivetrain, setDrivetrain] = useState<string>("");
    const [engineType, setEngineType] = useState<string>("");
    const [fuelType, setFuelType] = useState<string>("");
    const [horsepower, setHorsepower] = useState<string>("");
    const [torque, setTorque] = useState<string>("");
    const [transmissionType, setTransmissionType] = useState<string>("");
    const [numberOfGears, setNumberOfGears] = useState<string>("");

    useEffect(() => {
        // Fetch manufacturers
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
                setCarModels(response);
            } catch (err) {
                setError("Failed to fetch car models.");
            }
        };

        fetchCarModels();
    }, [manufacturerId]);

    useEffect(() => {
        // Fetch generations when a car model is selected
        const fetchGenerations = async () => {
            if (!carModelId) return;
            try {
                const response = await getAllByCarModel(carModelId);
                setGenerations(response);
            } catch (err) {
                setError("Failed to fetch generations.");
            }
        };

        fetchGenerations();
    }, [carModelId]);

    const setDefaultStates = () => {
        setName("");
        setManufacturerId(null);
        setCarModelId(null);
        setGenerationId(null);
        setDrivetrain("");
        setEngineType("");
        setFuelType("");
        setHorsepower("");
        setTorque("");
        setTransmissionType("");
        setNumberOfGears("");
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || !manufacturerId || !carModelId || !generationId || !drivetrain || !engineType || !fuelType || !horsepower || !torque || !transmissionType || !numberOfGears) {
            setError("All fields are required.");
            return;
        }

        const request: ModificationCreateRequest = {
            name: name.trim(),
            generationId,
            drivetrain: { type: drivetrain.trim() },
            engine: {
                type: engineType.trim(),
                fuelType: fuelType.trim(),
                horsepower: Number(horsepower),
                torque: Number(torque),
            },
            transmission: {
                type: transmissionType.trim(),
                numberOfGears: Number(numberOfGears),
            },
        };

        try {
            await create(request);
            setDefaultStates();
        } catch (err) {
            setError("Failed to create modification.");
            console.error(err);
        }
    };

    return (
        <>
            <CustomForm title="Modification Info" onSubmit={handleSubmit} error={error} submitLabel="Submit">
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
                    <Label htmlFor="generation">Generation</Label>
                    <Select
                        onValueChange={(value) => setGenerationId(Number(value))}
                        disabled={!carModelId}
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a generation..." />
                        </SelectTrigger>
                        <SelectContent>
                            {generations.map((generation) => (
                                <SelectItem key={generation.id} value={generation.id.toString()}>
                                    {generation.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="modificationName">Modification Name</Label>
                    <Input
                        id="modificationName"
                        type="text"
                        placeholder="Enter modification name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="drivetrain">Drivetrain</Label>
                    <Input
                        id="drivetrain"
                        type="text"
                        placeholder="Enter drivetrain type..."
                        value={drivetrain}
                        onChange={(e) => setDrivetrain(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="engineType">Engine Type</Label>
                    <Input
                        id="engineType"
                        type="text"
                        placeholder="Enter engine type..."
                        value={engineType}
                        onChange={(e) => setEngineType(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Input
                        id="fuelType"
                        type="text"
                        placeholder="Enter fuel type..."
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="horsepower">Horsepower</Label>
                    <Input
                        id="horsepower"
                        type="number"
                        placeholder="Enter horsepower..."
                        value={horsepower}
                        onChange={(e) => setHorsepower(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="torque">Torque</Label>
                    <Input
                        id="torque"
                        type="number"
                        placeholder="Enter torque..."
                        value={torque}
                        onChange={(e) => setTorque(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="transmissionType">Transmission Type</Label>
                    <Input
                        id="transmissionType"
                        type="text"
                        placeholder="Enter transmission type..."
                        value={transmissionType}
                        onChange={(e) => setTransmissionType(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="numberOfGears">Number of Gears</Label>
                    <Input
                        id="numberOfGears"
                        type="number"
                        placeholder="Enter number of gears..."
                        value={numberOfGears}
                        onChange={(e) => setNumberOfGears(e.target.value)}
                        required
                    />
                </div>
            </CustomForm>
        </>
    );
}