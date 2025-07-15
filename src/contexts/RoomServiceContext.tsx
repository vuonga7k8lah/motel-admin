"use client";

import type React from "react";
import { createContext, useContext, useState, type ReactNode } from "react";

// Define the shape of a service item
export interface ServiceItem {
    name: string;
    type: string;
    cost: string;
    processingTime: string;
    enabled: boolean;
}

// Define the context type
interface RoomServiceContextType {
    services: ServiceItem[];
    updateServices: (services: ServiceItem[]) => void;
}

// Create the context with default values
const RoomServiceContext = createContext<RoomServiceContextType | undefined>(
    undefined
);

// Create a provider component
export const RoomServiceProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [services, setServices] = useState<ServiceItem[]>([
        {
            name: "Tiền nước",
            type: "flat_rate",
            cost: "5.99",
            processingTime: "3-5",
            enabled: true,
        },
    ]);

    const updateServices = (newServices: ServiceItem[]) => {
        setServices(newServices);
    };

    return (
        <RoomServiceContext.Provider value={{ services, updateServices }}>
            {children}
        </RoomServiceContext.Provider>
    );
};

// Create a custom hook to use the context
export const useRoomService = (): RoomServiceContextType => {
    const context = useContext(RoomServiceContext);
    if (!context) {
        throw new Error(
            "useRoomService must be used within a RoomServiceProvider"
        );
    }
    return context;
};
