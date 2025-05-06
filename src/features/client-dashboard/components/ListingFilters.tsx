import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getAll as getAllManufacturers } from '@/api/catalog/manufacturers';
import { getAllByManufacturer as getModelsByManufacturer } from '@/api/catalog/carModels';
import { getAllByCarModel as getGenerationsByModel } from '@/api/catalog/generations';
import { getAllByGeneration as getModificationsByGeneration } from '@/api/catalog/modifications';
import { Manufacturer } from '@/api/catalog/manufacturers';
import { CarModel } from '@/api/catalog/carModels';
import { Generation } from '@/api/catalog/generations';
import { Modification } from '@/api/catalog/modifications';
import { saveFilter, getSavedFilters, Filter, SavedSearch } from '@/api/listings/listings';

export default function ListingFilters() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Listing-specific filters
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [minMileage, setMinMileage] = useState(searchParams.get('minMileage') || '');
    const [maxMileage, setMaxMileage] = useState(searchParams.get('maxMileage') || '');

    // Catalog-specific filters
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [models, setModels] = useState<CarModel[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [modifications, setModifications] = useState<Modification[]>([]);

    const [selectedManufacturer, setSelectedManufacturer] = useState(searchParams.get('manufacturerId') || '');
    const [selectedModel, setSelectedModel] = useState(searchParams.get('carModelId') || '');
    const [selectedGeneration, setSelectedGeneration] = useState(searchParams.get('generationId') || '');
    const [selectedModification, setSelectedModification] = useState(searchParams.get('modificationId') || '');

    // Load manufacturers on mount
    useEffect(() => {
        const loadManufacturers = async () => {
            try {
                const data = await getAllManufacturers();
                setManufacturers(data);
            } catch (error) {
                console.error('Failed to load manufacturers:', error);
            }
        };
        loadManufacturers();
    }, []);

    // Load models when manufacturer is selected
    useEffect(() => {
        const loadModels = async () => {
            if (!selectedManufacturer) {
                setModels([]);
                setSelectedModel('');
                setSelectedGeneration('');
                setSelectedModification('');
                return;
            }
            try {
                const data = await getModelsByManufacturer(parseInt(selectedManufacturer));
                setModels(data);
            } catch (error) {
                console.error('Failed to load models:', error);
            }
        };
        loadModels();
    }, [selectedManufacturer]);

    // Load generations when model is selected
    useEffect(() => {
        const loadGenerations = async () => {
            if (!selectedModel) {
                setGenerations([]);
                setSelectedGeneration('');
                setSelectedModification('');
                return;
            }
            try {
                const data = await getGenerationsByModel(parseInt(selectedModel));
                setGenerations(data);
            } catch (error) {
                console.error('Failed to load generations:', error);
            }
        };
        loadGenerations();
    }, [selectedModel]);

    // Load modifications when generation is selected
    useEffect(() => {
        const loadModifications = async () => {
            if (!selectedGeneration) {
                setModifications([]);
                setSelectedModification('');
                return;
            }
            try {
                const data = await getModificationsByGeneration(parseInt(selectedGeneration));
                setModifications(data);
            } catch (error) {
                console.error('Failed to load modifications:', error);
            }
        };
        loadModifications();
    }, [selectedGeneration]);

    const [savedFilters, setSavedFilters] = useState<SavedSearch[]>([]);
    const [selectedSavedFilter, setSelectedSavedFilter] = useState<string>('');

    // Fetch saved filters on mount
    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const data = await getSavedFilters();
                setSavedFilters(data);
            } catch (err) {
                console.error('Failed to fetch saved filters:', err);
            }
        };
        fetchSaved();
    }, []);

    // When a saved filter is selected, populate fields
    useEffect(() => {
        if (!selectedSavedFilter) return;
        const saved = savedFilters.find(f => f.name === selectedSavedFilter);
        if (!saved) return;
        const filter: Filter = saved.filters;
        setMinPrice(filter.minPrice !== null && filter.minPrice !== undefined ? filter.minPrice.toString() : '');
        setMaxPrice(filter.maxPrice !== null && filter.maxPrice !== undefined ? filter.maxPrice.toString() : '');
        setMinMileage(filter.minMileage !== null && filter.minMileage !== undefined ? filter.minMileage.toString() : '');
        setMaxMileage(filter.maxMileage !== null && filter.maxMileage !== undefined ? filter.maxMileage.toString() : '');
        setSelectedManufacturer(filter.manufacturerId !== null && filter.manufacturerId !== undefined ? filter.manufacturerId.toString() : '');
        setSelectedModel(filter.carModelId !== null && filter.carModelId !== undefined ? filter.carModelId.toString() : '');
        setSelectedGeneration(filter.generationId !== null && filter.generationId !== undefined ? filter.generationId.toString() : '');
        setSelectedModification(''); // Not in Filter type, clear
    }, [selectedSavedFilter, savedFilters]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams();

        // Add listing-specific filters
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (minMileage) params.set('minMileage', minMileage);
        if (maxMileage) params.set('maxMileage', maxMileage);

        // Add catalog-specific filters
        if (selectedManufacturer) params.set('manufacturerId', selectedManufacturer);
        if (selectedModel) params.set('carModelId', selectedModel);
        if (selectedGeneration) params.set('generationId', selectedGeneration);
        if (selectedModification) params.set('modificationId', selectedModification);

        setSearchParams(params);
    };

    const handleClearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setMinMileage('');
        setMaxMileage('');
        setSelectedManufacturer('');
        setSelectedModel('');
        setSelectedGeneration('');
        setSelectedModification('');
        setSearchParams(new URLSearchParams());
    };

    // Save filter handler
    const handleSaveFilter = async () => {
        const name = window.prompt('Enter a name for this filter:');
        if (!name) return;

        // Build filter object, set unused fields as null
        const filter: Filter = {
            minPrice: minPrice ? Number(minPrice) : null,
            maxPrice: maxPrice ? Number(maxPrice) : null,
            minMileage: minMileage ? Number(minMileage) : null,
            maxMileage: maxMileage ? Number(maxMileage) : null,
            manufacturerId: selectedManufacturer ? Number(selectedManufacturer) : null,
            carModelId: selectedModel ? Number(selectedModel) : null,
            generationId: selectedGeneration ? Number(selectedGeneration) : null,
            drivetrainType: null,
            fuelType: null,
            minHorsepower: null,
            maxHorsepower: null,
            transmissionType: null,
        };

        try {
            await saveFilter(name, filter);
            alert('Filter saved!');
            // Refresh saved filters
            const data = await getSavedFilters();
            setSavedFilters(data);
        } catch (err) {
            alert('Failed to save filter.');
            console.error(err);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Filter Listings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="minPrice">Min Price</Label>
                        <Input
                            id="minPrice"
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min price"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPrice">Max Price</Label>
                        <Input
                            id="maxPrice"
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max price"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="minMileage">Min Mileage</Label>
                        <Input
                            id="minMileage"
                            type="number"
                            value={minMileage}
                            onChange={(e) => setMinMileage(e.target.value)}
                            placeholder="Min mileage"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxMileage">Max Mileage</Label>
                        <Input
                            id="maxMileage"
                            type="number"
                            value={maxMileage}
                            onChange={(e) => setMaxMileage(e.target.value)}
                            placeholder="Max mileage"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Manufacturer</Label>
                    <Select
                        value={selectedManufacturer}
                        onValueChange={setSelectedManufacturer}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select manufacturer" />
                        </SelectTrigger>
                        <SelectContent>
                            {manufacturers.map((manufacturer) => (
                                <SelectItem
                                    key={manufacturer.id}
                                    value={manufacturer.id.toString()}
                                >
                                    {manufacturer.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                        disabled={!selectedManufacturer}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                            {models.map((model) => (
                                <SelectItem
                                    key={model.id}
                                    value={model.id.toString()}
                                >
                                    {model.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Generation</Label>
                    <Select
                        value={selectedGeneration}
                        onValueChange={setSelectedGeneration}
                        disabled={!selectedModel}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select generation" />
                        </SelectTrigger>
                        <SelectContent>
                            {generations.map((generation) => (
                                <SelectItem
                                    key={generation.id}
                                    value={generation.id.toString()}
                                >
                                    {generation.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Modification</Label>
                    <Select
                        value={selectedModification}
                        onValueChange={setSelectedModification}
                        disabled={!selectedGeneration}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select modification" />
                        </SelectTrigger>
                        <SelectContent>
                            {modifications.map((modification) => (
                                <SelectItem
                                    key={modification.id}
                                    value={modification.id.toString()}
                                >
                                    {modification.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Saved Filters Dropdown */}
                <div className="space-y-2">
                    <Label>Saved Filters</Label>
                    <Select
                        value={selectedSavedFilter}
                        onValueChange={setSelectedSavedFilter}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select saved filter" />
                        </SelectTrigger>
                        <SelectContent>
                            {savedFilters.map((filter) => (
                                <SelectItem key={filter.name} value={filter.name}>
                                    {filter.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='space-y-2'>
                    <div className='grid grid-cols-2 gap-2'>
                        <Button variant="outline" onClick={handleClearFilters} className="w-full">
                            Clear
                        </Button>
                        <Button onClick={handleApplyFilters} className="w-full">
                            Apply
                        </Button>
                    </div>
                    <Button onClick={handleSaveFilter} className="w-full">
                        Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 