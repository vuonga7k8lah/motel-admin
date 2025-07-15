import { ShoppingCart } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <a href="/" className="font-bold text-xl">
                    DECOR BY MILLER
                </a>

                <div className="hidden md:flex items-center space-x-8">
                    <a
                        href="/products"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        All Products
                    </a>
                    <a
                        href="/sofa"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Sofa
                    </a>
                    <a
                        href="/chair"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Chair
                    </a>
                    <a
                        href="/table"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Table
                    </a>
                </div>

                <div className="flex items-center space-x-6">
                    <a
                        href="/about"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        About Us
                    </a>
                    <a
                        href="/account"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        My Account
                    </a>
                    <div className="relative">
                        <ShoppingCart className="h-6 w-6 text-gray-600" />
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            0
                        </span>
                        <span className="ml-2 text-gray-600">£0.00</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
