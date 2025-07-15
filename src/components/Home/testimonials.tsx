const testimonials = [
    {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
        author: "Patricia Warren",
        image: "/placeholder.svg?height=60&width=60",
    },
    {
        text: "Convallis lacinia optio! Hac morbi laboris similique hymenaeos, nulla, magnis cupti nisi dis dolores optent eveniet nostrud eu.",
        author: "Lauren Luna",
        image: "/placeholder.svg?height=60&width=60",
    },
    {
        text: "Semper laboris possimus, molestiae, qnim ornare? Molestie! Dictumst sollicitudin quo, autem leo. Autem integer dignissim.",
        author: "Paul Smithen",
        image: "/placeholder.svg?height=60&width=60",
    },
];

export default function Testimonials() {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Testimonials
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="text-center">
                            <p className="text-gray-600 mb-6">
                                "{testimonial.text}"
                            </p>
                            <div className="flex items-center justify-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    width={60}
                                    height={60}
                                    className="rounded-full"
                                />
                                <span className="ml-4 font-medium">
                                    {testimonial.author}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
