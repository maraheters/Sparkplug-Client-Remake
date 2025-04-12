import { apiFetch } from "@/api/api";

const BASE = "/catalog/modifications";

export type Modification = {
    id: number;
    name: string;
    generationId: number;
    drivetrain: Drivetrain;
    engine: Engine;
    transmission: Transmission;
};

export type Drivetrain = {
    type: string
};

export type Engine = {
    fuelType: string;
    type: string;
    horsepower: number;
    torque: number;
}

export type Transmission = {
    type: string;
    numberOfGears: number;
}

export type ModificationCreateRequest = {
    name: string;
    country: string;
};

export const getAll = (): Promise<Modification[]> => {
    return apiFetch(`${BASE}`);
};

export const getById = (id: number): Promise<Modification> => {
    return apiFetch(`${BASE}/${id}`);
};

export const create = (dto: ModificationCreateRequest): Promise<void> => {
    return apiFetch(`${BASE}`, {
        method: "POST",
        body: JSON.stringify(dto),
    }, true); 
};

export const deleteById = (id: number): Promise<void> => {
    return apiFetch(`${BASE}/${id}`, {
        method: "DELETE",
    }, true);
};
