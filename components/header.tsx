"use client"

import { Cart } from "@/components/cart"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">VeggieFresh</h1>
          </div>

          {/* Cart component with PayPal checkout */}
          <Cart />
        </div>
      </div>
    </header>
  )
}
