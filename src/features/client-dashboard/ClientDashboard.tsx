import { useEffect, useState } from 'react';
import { Listing, getAllListings } from '@/api/listings/listings';
import ListingCard from '../listings/cards/ListingCard';

export const ClientDashboard = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const data = await getAllListings();
                setListings(data);
            } catch (err) {
                setError('Failed to fetch listings');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Available Listings</h1>
            <div className="space-y-4">
                {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
        </div>
    );
}; 