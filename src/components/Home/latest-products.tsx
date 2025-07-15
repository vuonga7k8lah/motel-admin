const products = [
    {
        id: 1,
        name: "Wooden Rocking Chair",
        price: "£99.00",
        image: "/placeholder.svg?height=300&width=300",
    },
    {
        id: 2,
        name: "Desktop table with Drawers",
        price: "£229.00",
        image: "/placeholder.svg?height=300&width=300",
    },
    {
        id: 3,
        name: "Orange Recliner with Leg Rest",
        price: "£499.00",
        image: "/placeholder.svg?height=300&width=300",
    },
    {
        id: 4,
        name: "Round Steel Leg Stool/Chair",
        price: "£229.00",
        image: "/placeholder.svg?height=300&width=300",
    },
];

export default function LatestProducts() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Our Latest Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="group">
                            <div className="relative h-64 mb-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                                {product.name}
                            </h3>
                            <p className="text-gray-600">{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
