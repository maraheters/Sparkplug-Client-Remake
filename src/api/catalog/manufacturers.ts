import { apiFetch } from "@/api/api";

const BASE = "/catalog/manufacturers";

export type Manufacturer = {
    id: number;
    name: string;
    country: string;
};

export type ManufacturerCreateRequest = {
    name: string;
    country: string;
};

export const getAll = (): Promise<Manufacturer[]> => {
    return apiFetch(`${BASE}`);
};

export const getById = (id: number): Promise<Manufacturer> => {
    return apiFetch(`${BASE}/${id}`);
};

export const create = (dto: ManufacturerCreateRequest): Promise<void> => {
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
