"use client"

import { ProductCard } from "@/components/product-card"

const vegetables = [
  {
    id: 1,
    name: "Organic Tomatoes",
    price: 4.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "Vine-ripened organic tomatoes, perfect for salads and cooking",
  },
  {
    id: 2,
    name: "Fresh Carrots",
    price: 2.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "Sweet, crunchy carrots packed with vitamins",
  },
  {
    id: 3,
    name: "Organic Spinach",
    price: 3.49,
    image: "/placeholder.svg?height=200&width=200",
    description: "Nutrient-rich baby spinach leaves, perfect for salads",
  },
  {
    id: 4,
    name: "Bell Peppers",
    price: 5.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "Crisp, colorful bell peppers in red, yellow, and green",
  },
  {
    id: 5,
    name: "Organic Broccoli",
    price: 3.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "Fresh, organic broccoli crowns rich in vitamins",
  },
  {
    id: 6,
    name: "Sweet Potatoes",
    price: 3.79,
    image: "/placeholder.svg?height=200&width=200",
    description: "Naturally sweet potatoes, perfect for roasting",
  },
  {
    id: 7,
    name: "Organic Lettuce",
    price: 2.49,
    image: "/placeholder.svg?height=200&width=200",
    description: "Crisp romaine lettuce, ideal for salads and wraps",
  },
  {
    id: 8,
    name: "Fresh Cucumbers",
    price: 2.79,
    image: "/placeholder.svg?height=200&width=200",
    description: "Cool, refreshing cucumbers perfect for snacking",
  },
]

export function ProductGrid() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-6">Our Fresh Vegetables</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vegetables.map((vegetable) => (
          <ProductCard key={vegetable.id} product={vegetable} />
        ))}
      </div>
    </section>
  )
}
