import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Listing, getListingById } from "@/api/listings/listings";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/AuthContext';

export default function ListingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userAuth } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListing = async () => {
            if (!id) return;
            try {
                const data = await getListingById(parseInt(id));
                setListing(data);
            } catch (err) {
                setError('Failed to fetch listing details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error || !listing) {
        return <div className="p-4 text-red-500">{error || 'Listing not found'}</div>;
    }

    const isCreator = userAuth?.id === listing.creatorId;

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Image Carousel */}
            <div className="w-full max-w-4xl mx-auto">
                <Carousel className="w-full">
                    <CarouselContent>
                        {listing.images.sort((a, b) => a.order - b.order).map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-video">
                                    <img
                                        src={image.url}
                                        alt={`${listing.carConfiguration.manufacturer.name} ${listing.carConfiguration.model.name} - Image ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            {/* Listing Details */}
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl">
                                {listing.carConfiguration.manufacturer.name} {listing.carConfiguration.model.name}
                            </CardTitle>
                            <CardDescription className="text-xl mt-2">
                                {listing.carConfiguration.generation.name}
                            </CardDescription>
                        </div>
                        <div className="text-3xl font-semibold text-primary">
                            ${listing.price.toLocaleString()}
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                            <div className="space-y-2 text-muted-foreground">
                                <p><span className="font-medium">Engine:</span> {listing.carConfiguration.engine.type}</p>
                                <p><span className="font-medium">Transmission:</span> {listing.carConfiguration.transmission.type}</p>
                                <p><span className="font-medium">Drivetrain:</span> {listing.carConfiguration.drivetrain.type}</p>
                                <p><span className="font-medium">Mileage:</span> {listing.mileage} km</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Engine Details</h3>
                            <div className="space-y-2 text-muted-foreground">
                                <p><span className="font-medium">Fuel Type:</span> {listing.carConfiguration.engine.fuelType}</p>
                                <p><span className="font-medium">Horsepower:</span> {listing.carConfiguration.engine.horsepower} HP</p>
                                <p><span className="font-medium">Torque:</span> {listing.carConfiguration.engine.torque} Nm</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground">{listing.description}</p>
                    </div>

                    {isCreator && (
                        <div className="flex justify-end mt-4">
                            <Button onClick={() => navigate(`/listings/${listing.id}/edit`)}>
                                Edit Listing
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 