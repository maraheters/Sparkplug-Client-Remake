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
    carModification: FullCarModification;
    createdAt: string;
    creatorId: number;
};

export type Image = {
    id: number;
    url: string;
    order: number;
}

export type FullCarModification = {
    id: number;
    name: string;
    generation: Generation;
    drivetrain: Drivetrain;
    engine: Engine;
    transmission: Transmission;
    model: CarModel;
    manufacturer: Manufacturer;
}

export const getAllListings = (): Promise<Listing[]> => {
    return apiFetch('/listings', {
        method: 'GET',
    });
};

export const getListingById = (id: number): Promise<Listing> => {
    return apiFetch(`/listings/${id}`, {
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