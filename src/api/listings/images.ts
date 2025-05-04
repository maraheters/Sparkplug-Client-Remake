import { apiFetch } from "../api";


export const updateImageOrder = (listingId: number, images: {id: number, order: number}[]) => {
    return apiFetch(`/listings/images/reorder?listingId=${listingId}`, {
        method: 'PUT',
        body: JSON.stringify(images),
    }, true);
};