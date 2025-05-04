import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomForm from "@/components/custom/CustomForm";
import { createListing } from "@/api/listings/listings";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAll as getAllManufacturers, Manufacturer } from "@/api/catalog/manufacturers";
import { getAllByManufacturer, CarModel } from "@/api/catalog/carModels";
import { getAllByCarModel, Generation } from "@/api/catalog/generations";
import { getAllByGeneration, Modification } from "@/api/catalog/modifications";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function CreateListingForm() {
    const navigate = useNavigate();
    const [selectedManufacturer, setSelectedManufacturer] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [selectedGeneration, setSelectedGeneration] = useState<string>("");
    const [selectedModification, setSelectedModification] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [mileage, setMileage] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const [error, setError] = useState<string>("");

    // State for dropdown data
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [carModels, setCarModels] = useState<CarModel[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [modifications, setModifications] = useState<Modification[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Fetch manufacturers on component mount
    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await getAllManufacturers();
                setManufacturers(response);
            } catch (error) {
                setError("Failed to fetch manufacturers");
            }
        };
        fetchManufacturers();
    }, []);

    // Fetch car models when manufacturer is selected
    useEffect(() => {
        const fetchCarModels = async () => {
            if (!selectedManufacturer) {
                setCarModels([]);
                setSelectedModel("");
                return;
            }
            try {
                const response = await getAllByManufacturer(parseInt(selectedManufacturer));
                setCarModels(response);
            } catch (error) {
                setError("Failed to fetch car models");
            }
        };
        fetchCarModels();
    }, [selectedManufacturer]);

    // Fetch generations when car model is selected
    useEffect(() => {
        const fetchGenerations = async () => {
            if (!selectedModel) {
                setGenerations([]);
                setSelectedGeneration("");
                return;
            }
            try {
                const response = await getAllByCarModel(parseInt(selectedModel));
                setGenerations(response);
            } catch (error) {
                setError("Failed to fetch generations");
            }
        };
        fetchGenerations();
    }, [selectedModel]);

    // Fetch modifications when generation is selected
    useEffect(() => {
        const fetchModifications = async () => {
            if (!selectedGeneration) {
                setModifications([]);
                setSelectedModification("");
                return;
            }
            try {
                const response = await getAllByGeneration(parseInt(selectedGeneration));
                setModifications(response);
            } catch (error) {
                setError("Failed to fetch modifications");
            }
        };
        fetchModifications();
    }, [selectedGeneration]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!selectedModification || !price || !mileage) {
            setError("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        if (images.length === 0) {
            setError("Please upload at least one image");
            setIsSubmitting(false);
            return;
        }

        try {
            await createListing(
                {
                    carModificationId: parseInt(selectedModification),
                    price: parseFloat(price),
                    mileage: parseInt(mileage),
                    description: description,
                },
                images
            );
            toast.success("Listing created successfully");
            navigate("/");
        } catch (error) {
            console.error("Failed to create listing:", error);
            setError("Failed to create listing. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(files);

            // Create previews for the images
            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        const newPreviews = [...imagePreviews];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const renderHoverContent = (item: any) => {
        if (!item) return null;

        const capitalize = (str: string) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        return (
            <div className="p-2 space-y-2">
                {Object.entries(item).map(([key, value]) => {
                    // Skip rendering 'id' field
                    if (key === 'id') return null;

                    if (typeof value === 'object' && value !== null) {
                        return (
                            <div key={key} className="space-y-1">
                                <div className="font-semibold text-sm">{capitalize(key)}:</div>
                                <div className="ml-4 space-y-1">
                                    {Object.entries(value).map(([subKey, subValue]) => {
                                        // Skip rendering 'id' field in nested objects
                                        if (subKey === 'id') return null;
                                        return (
                                            <div key={subKey} className="text-sm">
                                                <span className="font-medium">{capitalize(subKey)}:</span> {String(subValue)}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={key} className="text-sm">
                            <span className="font-medium">{capitalize(key)}:</span> {String(value)}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <CustomForm 
            title="Create New Listing" 
            onSubmit={handleSubmit} 
            error={error} 
            submitLabel={isSubmitting ? "Creating..." : "Create Listing"}
        >
            <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                        {manufacturers.map((manufacturer) => (
                            <HoverCard key={manufacturer.id}>
                                <HoverCardTrigger asChild>
                                    <SelectItem value={manufacturer.id.toString()}>
                                        {manufacturer.name}
                                    </SelectItem>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    {renderHoverContent(manufacturer)}
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="model">Model</Label>
                <Select 
                    value={selectedModel} 
                    onValueChange={setSelectedModel}
                    disabled={!selectedManufacturer}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                        {carModels.map((model) => (
                            <HoverCard key={model.id}>
                                <HoverCardTrigger asChild>
                                    <SelectItem value={model.id.toString()}>
                                        {model.name}
                                    </SelectItem>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    {renderHoverContent(model)}
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="generation">Generation</Label>
                <Select 
                    value={selectedGeneration} 
                    onValueChange={setSelectedGeneration}
                    disabled={!selectedModel}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select generation" />
                    </SelectTrigger>
                    <SelectContent>
                        {generations.map((generation) => (
                            <HoverCard key={generation.id}>
                                <HoverCardTrigger asChild>
                                    <SelectItem value={generation.id.toString()}>
                                        {generation.name}
                                    </SelectItem>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    {renderHoverContent(generation)}
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="modification">Modification</Label>
                <Select 
                    value={selectedModification} 
                    onValueChange={setSelectedModification}
                    disabled={!selectedGeneration}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select modification" />
                    </SelectTrigger>
                    <SelectContent>
                        {modifications.map((modification) => (
                            <HoverCard key={modification.id}>
                                <HoverCardTrigger asChild>
                                    <SelectItem value={modification.id.toString()}>
                                        {modification.name}
                                    </SelectItem>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    {renderHoverContent(modification)}
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                />
            </div>

            <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                    id="mileage"
                    type="number"
                    placeholder="Enter mileage"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    required
                    min="0"
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="images">Images</Label>
                <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-2"
                />
                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CustomForm>
    );
} 