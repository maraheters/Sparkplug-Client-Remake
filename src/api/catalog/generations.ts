import { apiFetch } from "@/api/api";
import { Modification } from "./modifications";

const BASE = "/catalog/generations";

export type Generation = {
    id: number;
    name: string;
    startYear: number;
    modifications: Modification[]
};

export type GenerationCreateRequest = {
    carModelId: number;
    name: string;
    startYear: number;
};

export const getAll = (): Promise<Generation[]> => {
    return apiFetch(`${BASE}`);
};

export const getById = (id: number): Promise<Generation> => {
    return apiFetch(`${BASE}/${id}`);
};

export const create = (dto: GenerationCreateRequest): Promise<void> => {
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
