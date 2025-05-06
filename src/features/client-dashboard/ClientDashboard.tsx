import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Listing, getAllListings } from '@/api/listings/listings';
import ListingCard from '../listings/cards/ListingCard';
import ListingFilters from './components/ListingFilters';

export const ClientDashboard = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const queryParams = new URLSearchParams(searchParams);
                const data = await getAllListings(queryParams);
                setListings(data);
            } catch (err) {
                setError('Failed to fetch listings');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [searchParams]);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <ListingFilters />
                </div>
                <div className="lg:col-span-3">
                    <h1 className="text-2xl font-bold mb-4">Available Listings</h1>
                    <div className="space-y-4">
                        {listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                        {listings.length === 0 && (
                            <div className="text-center text-muted-foreground">
                                No listings found matching your criteria
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 