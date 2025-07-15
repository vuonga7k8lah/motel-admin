import { Button } from "@/components/ui/button";
import Features from "@/components/Home/feature";
import LatestProducts from "@/components/Home/latest-products";
import Testimonials from "@/components/Home/testimonials";
import SocialConnect from "@/components/Home/social-connect";
export default function Home() {
    return (
        <main>
            {/* Hero Section */}
            <section className="bg-gray-50">
                <div className="container mx-auto px-4 py-20">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <h1 className="text-5xl font-bold text-slate-600 leading-tight">
                                Style
                                <br />
                                Comfort &
                                <br />
                                Affordable
                            </h1>
                            <Button
                                variant="outline"
                                className="rounded-none px-8"
                            >
                                Explore Store
                            </Button>
                        </div>
                        <div className="relative h-[500px]">
                            <img
                                src="https://websitedemos.net/furniture-store-04/wp-content/uploads/sites/155/2020/02/sofa-bg-banner.jpg"
                                alt="Modern white chair"
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Collections Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Chair Collection */}
                        <div className="relative bg-gray-100 p-8 min-h-[300px] flex items-center">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-slate-600">
                                    Chair Collection!
                                </h2>
                                <p className="text-gray-600">
                                    Launch Offer 15% Off!
                                </p>
                                <Button
                                    variant="outline"
                                    className="rounded-none"
                                >
                                    → View Collection
                                </Button>
                            </div>
                        </div>

                        {/* Modern Collection */}
                        <div className="relative bg-pink-100 p-8 min-h-[300px] flex items-center">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-slate-600">
                                    Modern Collection!
                                </h2>
                                <p className="text-gray-600">
                                    New Season Stock
                                </p>
                                <Button
                                    variant="outline"
                                    className="rounded-none"
                                >
                                    → View Collection
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <Features />

            {/* Sale Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-red-600">
                                Sale!
                            </h2>
                            <p className="text-2xl text-gray-600">
                                10% Off On All Products!
                            </p>
                            <Button variant="outline" className="rounded-none">
                                Shop Now
                            </Button>
                        </div>
                        <div className="relative h-[400px]">
                            <img
                                src="/placeholder.svg?height=400&width=400"
                                alt="Sale promotion"
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Products */}
            <LatestProducts />

            {/* Testimonials */}
            <Testimonials />

            {/* Social Connect */}
            <SocialConnect />
        </main>
    );
}
