"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
    images: string | string[];
    aspectRatio?: number;
}

export function ImageGallery({ images, aspectRatio = 1 }: ImageGalleryProps) {
    // Handle comma-separated string of URLs
    const imageArray =
        typeof images === "string"
            ? images.split(",").filter(Boolean)
            : Array.isArray(images)
            ? images.filter(Boolean)
            : [];

    const [currentIndex, setCurrentIndex] = useState(0);

    // If no images or empty string, show placeholder
    if (!imageArray.length) {
        return (
            <AspectRatio ratio={aspectRatio} className="bg-muted">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    No image available
                </div>
            </AspectRatio>
        );
    }

    // If only one image, show it without navigation
    if (imageArray.length === 1) {
        return (
            <AspectRatio ratio={aspectRatio} className="bg-muted">
                <img
                    src={imageArray[0] || "/placeholder.svg"}
                    alt="Room image"
                    className="h-full w-full rounded-md object-cover"
                />
            </AspectRatio>
        );
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % imageArray.length);
    };

    const prevImage = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + imageArray.length) % imageArray.length
        );
    };

    return (
        <div className="relative group">
            <AspectRatio ratio={aspectRatio} className="bg-muted">
                <img
                    src={imageArray[currentIndex] || "/placeholder.svg"}
                    alt={`Image ${currentIndex + 1} of ${imageArray.length}`}
                    className="h-full w-full rounded-md object-cover"
                />
            </AspectRatio>

            {imageArray.length > 1 && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 bg-background"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 bg-background"
                        onClick={nextImage}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {imageArray.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 w-1.5 rounded-full ${
                                    index === currentIndex
                                        ? "bg-primary"
                                        : "bg-muted-foreground/50"
                                }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
