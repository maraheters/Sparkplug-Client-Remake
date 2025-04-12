import { apiFetch } from "@/api/api";
import { Generation } from "./generations";

const BASE = "/catalog/models";

export type CarModel = {
    id: number;
    name: string;
    generations: Generation[]
}

export type CarModelCreateRequest = {
    name: string;
    manufacturerId: number;
}

export const getAll = (): Promise<CarModel[]> => {
    return apiFetch(`${BASE}`);
};

export const getAllByManufacturer = (manufacturerId: number): Promise<CarModel[]> => {
    return apiFetch(`/catalog/manufacturers/${manufacturerId}/models`, { 
        method: 'GET' 
    }, true);
};

export const getById = (id: number): Promise<CarModel> => {
    return apiFetch(`${BASE}/${id}`);
};

export const create = (dto: CarModelCreateRequest): Promise<void> => {
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
