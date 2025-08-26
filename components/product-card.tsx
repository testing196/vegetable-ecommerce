"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Create unique PayPal button ID for each product
  const paypalButtonId = `paypal-add-to-cart-${product.id}`

  return (
    <Card className="bg-card border-border hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>
        <h3 className="font-semibold text-card-foreground mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
        <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {/* PayPal Add to Cart Button - Unique ID for each product */}
        <div id={paypalButtonId} className="w-full flex-none"></div>
      </CardFooter>
    </Card>
  )
}
