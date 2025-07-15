import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export default function SocialConnect() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8">Connect with Us</h2>
                <div className="flex justify-center space-x-6">
                    <a href="#" className="p-2 rounded-full hover:bg-gray-100">
                        <Facebook className="h-6 w-6 text-gray-600" />
                    </a>
                    <a href="#" className="p-2 rounded-full hover:bg-gray-100">
                        <Twitter className="h-6 w-6 text-gray-600" />
                    </a>
                    <a href="#" className="p-2 rounded-full hover:bg-gray-100">
                        <Instagram className="h-6 w-6 text-gray-600" />
                    </a>
                    <a href="#" className="p-2 rounded-full hover:bg-gray-100">
                        <Linkedin className="h-6 w-6 text-gray-600" />
                    </a>
                    <a href="#" className="p-2 rounded-full hover:bg-gray-100">
                        <Youtube className="h-6 w-6 text-gray-600" />
                    </a>
                </div>
            </div>
        </section>
    );
}
