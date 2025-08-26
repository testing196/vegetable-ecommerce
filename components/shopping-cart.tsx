"use client"

import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-context"
import { PayPalCheckout } from "@/components/paypal-checkout"
import { OrderConfirmation } from "@/components/order-confirmation"

export function ShoppingCart() {
  const { items, removeItem, updateQuantity, isOpen, toggleCart, total } = useCart()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [transactionId, setTransactionId] = useState("")

  const handlePaymentSuccess = (txnId: string) => {
    setTransactionId(txnId)
    setShowConfirmation(true)
  }

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error)
    alert("Payment failed. Please try again.")
  }

  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
    setTransactionId("")
    toggleCart()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
        <div className="w-full max-w-md bg-background h-full overflow-y-auto">
          <Card className="h-full rounded-none border-l">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Shopping Cart</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={toggleCart}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex flex-col h-full">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/50" />
                  <div className="text-center">
                    <p className="text-muted-foreground font-medium">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add some fresh vegetables to get started!</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 border border-border rounded-lg bg-card"
                      >
                        <div className="w-16 h-16 relative overflow-hidden rounded-md">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-card-foreground">{item.name}</h4>
                          <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>

                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-destructive hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mt-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span className="text-primary">Free</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground text-center">
                        Secure checkout powered by PayPal • Free shipping on all orders
                      </p>
                      <PayPalCheckout onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {showConfirmation && <OrderConfirmation transactionId={transactionId} onClose={handleCloseConfirmation} />}
    </>
  )
}
