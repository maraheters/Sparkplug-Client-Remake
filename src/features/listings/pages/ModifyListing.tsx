import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Listing, getListingById } from "@/api/listings/listings";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";
import { useAuth } from '@/hooks/AuthContext';
import { Separator } from "@/components/ui/separator";
import { updateImageOrder } from '@/api/listings/images';

interface ImageOrder {
    id: number;
    order: number;
}

export default function ModifyListing() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userAuth } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<ImageOrder[]>([]);

    useEffect(() => {
        const fetchListing = async () => {
            if (!id) return;
            try {
                const data = await getListingById(parseInt(id));
                setListing(data);
                setImages(data.images.map(img => ({ id: img.id, order: img.order })));
            } catch (err) {
                setError('Failed to fetch listing details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update order numbers
        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index
        }));

        setImages(updatedItems);
    };

    const handleSave = async () => {
        try {
            await updateImageOrder(parseInt(id!), images);
            navigate(`/listings/${id}`);
        } catch (err) {
            console.error('Failed to update image order:', err);
        }
    };

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error || !listing) {
        return <div className="p-4 text-red-500">{error || 'Listing not found'}</div>;
    }

    if (userAuth?.id !== listing.creatorId) {
        return <div className="p-4 text-red-500">You don't have permission to edit this listing</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-6 space-y-4">
                    <div>
                        <CardTitle className="text-3xl">
                            {listing.carConfiguration.manufacturer.name} {listing.carConfiguration.model.name}
                        </CardTitle>
                        <CardDescription className="text-xl mt-2">
                            Edit Image Order
                        </CardDescription>
                    </div>

                    <Separator className="my-4" />

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="images">
                            {(provided: DroppableProvided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-2"
                                >
                                    {images.map((image, index) => (
                                        <Draggable
                                            key={image.id}
                                            draggableId={image.id.toString()}
                                            index={index}
                                        >
                                            {(provided: DraggableProvided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="flex items-center p-4 bg-background border rounded-lg"
                                                >
                                                    <div className="w-24 h-24 mr-4">
                                                        <img
                                                            src={listing.images.find(img => img.id === image.id)?.url}
                                                            alt={`Image ${index + 1}`}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    </div>
                                                    <span className="text-muted-foreground">
                                                        Order: {image.order + 1}
                                                    </span>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div className="flex justify-end space-x-4 mt-4">
                        <Button variant="outline" onClick={() => navigate(`/listings/${id}`)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            Apply Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 