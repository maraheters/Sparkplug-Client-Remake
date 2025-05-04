import { Listing } from "@/api/listings/listings";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

export default function ListingCard({ listing }: { listing: Listing }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/listings/${listing.id}`);
    };

    return (
        <Card key={listing.id} className="flex p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
            <div className="flex flex-row w-full">
                <div className="w-96 h-72 overflow-hidden rounded-md">
                    <img
                        src={listing.images.sort((a, b) => a.order - b.order)[0].url || '/placeholder-car.jpg'}
                        alt={`${listing.carModification.manufacturer.name} ${listing.carModification.model.name}`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <CardContent className="flex-1 flex flex-col justify-between">
                    <div>
                        <CardTitle className="text-2xl">
                            {listing.carModification.manufacturer.name} {listing.carModification.model.name}
                        </CardTitle>
                        <CardDescription className="text-xl">
                            {listing.carModification.generation.name}
                        </CardDescription>
                        <div className="text-base text-muted-foreground mt-2">
                            <p>{listing.carModification.engine.type} • {listing.carModification.transmission.type} • {listing.carModification.drivetrain.type}</p>
                            <p>Mileage: {listing.mileage} km</p>
                        </div>
                    </div>
                    <div className="text-2xl font-semibold text-primary">
                        ${listing.price.toLocaleString()}
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}