import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="bg-white py-16 border-t">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">Product as</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/products"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    All Products
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/sofa"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Sofa
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/chair"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Chair
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/table"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Table
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Chairs</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/armchair"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Armchair
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/recliner"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Recliner
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/stool"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Stool
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Table</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/study-table"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Study Table
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/computer-table"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Computer Table
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Have Questions?</h3>
                        <Button variant="outline" className="rounded-none">
                            Contact Us
                        </Button>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-gray-600">
                    <p>Copyright © 2024 Furniture Store</p>
                    <p>Powered by Furniture Store</p>
                </div>
            </div>
        </footer>
    );
}
