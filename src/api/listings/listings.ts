import { apiFetch } from "@/api/api";
import { Generation } from "../catalog/generations";
import { Drivetrain, Engine, Transmission } from "../catalog/modifications";
import { CarModel } from "../catalog/carModels";
import { Manufacturer } from "../catalog/manufacturers";

export type CreateListingRequest = {
    carModificationId: number;
    price: number;
    mileage: number;
    description: string;
};

export type Listing = {
    id: number;
    price: number;
    mileage: number;
    description: string;
    images: Image[];
    carConfiguration: CarConfiguration;
    createdAt: string;
    creatorId: number;
};

export type Image = {
    id: number;
    url: string;
    order: number;
}

export type CarConfiguration = {
    id: number;
    name: string;
    generation: Generation;
    drivetrain: Drivetrain;
    engine: Engine;
    transmission: Transmission;
    model: CarModel;
    manufacturer: Manufacturer;
}

export type Filter = {
    minPrice: number | null;
    maxPrice: number | null;
    minMileage: number | null;
    maxMileage: number | null;
    manufacturerId: number | null;
    carModelId: number | null;
    generationId: number | null;
    drivetrainType: string | null;
    fuelType: string | null;
    minHorsepower: number | null;
    maxHorsepower: number | null;
    transmissionType: string | null;
};

export type SavedSearch = {
    id: string;
    userId: number;
    name: string;
    filters: Filter;
    createdAt: string;
    lastUsed: string;
};

export const getAllListings = (params?: URLSearchParams): Promise<Listing[]> => {
    const queryString = params ? `?${params.toString()}` : '';
    return apiFetch(`/listings${queryString}`, {
        method: 'GET',
    });
};

export const getListingById = (id: number): Promise<Listing> => {
    return apiFetch(`/listings/${id}`, {
        method: 'GET',
    });
};

export const getListingsByUserId = (userId: number): Promise<Listing[]> => {
    return apiFetch(`/listings/user/${userId}`, {
        method: 'GET',
    });
};

export const createListing = (listing: CreateListingRequest, images: File[]): Promise<any> => {
    const formData = new FormData();
    const listingBlob = new Blob([JSON.stringify(listing)], { type: 'application/json' });
    formData.append('listing', listingBlob);
    images.forEach((image) => {
        formData.append('images', image);
    });

    return apiFetch('/listings', {
        method: 'POST',
        body: formData,
    }, true);
};

export const saveFilter = (name: string, filter: Filter): Promise<any> => {
    return apiFetch(`/listings/saved-searches?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        body: JSON.stringify(filter),
    }, true);
};

export const getSavedFilters = (): Promise<SavedSearch[]> => {
    return apiFetch('/listings/saved-searches', {
        method: 'GET',
    }, true);
}; 