import { Clock, Truck, Wrench, Headphones, Shield } from "lucide-react";

export default function Features() {
    const features = [
        { icon: Clock, text: "10 Years Experience" },
        { icon: Truck, text: "Flexible Delivery" },
        { icon: Wrench, text: "Free Installation" },
        { icon: Headphones, text: "After Sales Support" },
        { icon: Shield, text: "5 Years Warranty" },
    ];

    return (
        <section className="py-16 border-y">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {features.map((Feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center"
                        >
                            <Feature.icon className="h-8 w-8 mb-4 text-slate-600" />
                            <p className="text-sm text-gray-600">
                                {Feature.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
