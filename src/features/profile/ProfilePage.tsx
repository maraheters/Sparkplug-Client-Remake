import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import { getListingsByUserId } from '@/api/listings/listings';
import { Listing } from '@/api/listings/listings';
import ListingCard from '../listings/cards/ListingCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ProfilePage = () => {
    const { userAuth } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserListings = async () => {
            if (!userAuth) return;
            
            try {
                const data = await getListingsByUserId(userAuth.id);
                setListings(data);
            } catch (err) {
                setError('Failed to fetch your listings');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserListings();
    }, [userAuth]);

    if (!userAuth) {
        return <div className="p-4">Please log in to view your profile</div>;
    }

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <span className="font-semibold">Username: </span>
                        {userAuth.username}
                    </div>
                    {userAuth.email && (
                        <div>
                            <span className="font-semibold">Email: </span>
                            {userAuth.email}
                        </div>
                    )}
                    {userAuth.phoneNumber && (
                        <div>
                            <span className="font-semibold">Phone: </span>
                            {userAuth.phoneNumber}
                        </div>
                    )}
                    <div>
                        <span className="font-semibold">Roles: </span>
                        {userAuth.authorities.join(', ')}
                    </div>
                </CardContent>
            </Card>

            <div>
                <h2 className="text-2xl font-bold mb-4">Your Listings</h2>
                <div className="space-y-4">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                    {listings.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            You haven't created any listings yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 