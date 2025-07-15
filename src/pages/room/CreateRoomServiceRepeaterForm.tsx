"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import {
    useRoomService,
    type ServiceItem,
} from "@/contexts/RoomServiceContext";

// Define the schema for validation
const serviceItemSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Service name must be at least 2 characters" }),
    type: z.enum(["free", "flat_rate", "weight_based", "distance_based"]),
    cost: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Cost must be a valid number",
    }),
    processingTime: z
        .string()
        .min(1, { message: "Processing time is required" }),
    enabled: z.boolean().default(true),
});

const formSchema = z.object({
    services: z
        .array(serviceItemSchema)
        .min(1, { message: "At least one service is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateRoomServiceRepeaterForm() {
    // Get the context
    const { services, updateServices } = useRoomService();

    // Track which items are expanded
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
        {
            0: true, // First item expanded by default
        }
    );

    // Initialize the form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            services: services,
        },
    });

    // Use fieldArray to handle the repeater functionality
    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "services",
    });

    // Update context when form values change
    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (value.services) {
                updateServices(value.services as ServiceItem[]);
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateServices]);

    // Toggle expansion state for an item
    const toggleExpansion = (index: number) => {
        setExpandedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // Add a new service
    const addService = () => {
        append({
            name: "New Service",
            type: "flat_rate",
            cost: "0.00",
            processingTime: "1-3",
            enabled: true,
        });
        // Expand the newly added item
        setExpandedItems((prev) => ({
            ...prev,
            [fields.length]: true,
        }));
    };

    return (
        <Form {...form}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold">
                        Room Services
                    </CardTitle>
                    <Button
                        type="button"
                        onClick={addService}
                        variant="outline"
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Service
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                            No services. Click the button above to add one.
                        </div>
                    ) : (
                        fields.map((field, index) => (
                            <Card
                                key={field.id}
                                className="border border-muted"
                            >
                                <Collapsible open={expandedItems[index]}>
                                    <div className="flex items-center justify-between p-4 border-b">
                                        <div className="flex items-center gap-3">
                                            <FormField
                                                control={form.control}
                                                name={`services.${index}.enabled`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <span className="font-medium">
                                                {form.watch(
                                                    `services.${index}.name`
                                                ) || "New Service"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="h-8 w-8 text-destructive"
                                                disabled={fields.length === 1} // Prevent removing the last method
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Remove
                                                </span>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    toggleExpansion(index)
                                                }
                                                className="h-8 w-8"
                                            >
                                                {expandedItems[index] ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">
                                                    {expandedItems[index]
                                                        ? "Collapse"
                                                        : "Expand"}
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                    <CollapsibleContent>
                                        <div className="p-4 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name={`services.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Service Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`services.${index}.type`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Service Type
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select service type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="free">
                                                                    Free Service
                                                                </SelectItem>
                                                                <SelectItem value="flat_rate">
                                                                    Flat Rate
                                                                </SelectItem>
                                                                <SelectItem value="weight_based">
                                                                    Weight Based
                                                                </SelectItem>
                                                                <SelectItem value="distance_based">
                                                                    Distance
                                                                    Based
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`services.${index}.cost`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Service Cost
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                                                    $
                                                                </span>
                                                                <Input
                                                                    {...field}
                                                                    className="pl-7"
                                                                    type="text"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`services.${index}.processingTime`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Processing Time
                                                            (days)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="e.g. 1-3"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </Card>
                        ))
                    )}
                </CardContent>
            </Card>
        </Form>
    );
}
