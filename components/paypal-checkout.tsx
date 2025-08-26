"use client"

import { useEffect, useRef, useState } from "react"
import { useCart } from "@/components/cart-context"
import { Loader2 } from "lucide-react"

interface PayPalCheckoutProps {
  onSuccess?: (transactionId: string) => void
  onError?: (error: any) => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

export function PayPalCheckout({ onSuccess, onError }: PayPalCheckoutProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const { items, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const checkPayPal = () => {
      if (window.paypal && paypalRef.current) {
        setIsLoading(false)
        // Clear any existing PayPal buttons
        paypalRef.current.innerHTML = ""

        window.paypal
          .Buttons({
            createOrder: (data: any, actions: any) => {
              setIsProcessing(true)
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: total.toFixed(2),
                      currency_code: "USD",
                      breakdown: {
                        item_total: {
                          currency_code: "USD",
                          value: total.toFixed(2),
                        },
                      },
                    },
                    description: `VeggieFresh Order - ${items.length} items`,
                    items: items.map((item) => ({
                      name: item.name,
                      unit_amount: {
                        currency_code: "USD",
                        value: item.price.toFixed(2),
                      },
                      quantity: item.quantity.toString(),
                    })),
                  },
                ],
              })
            },
            onApprove: async (data: any, actions: any) => {
              try {
                const details = await actions.order.capture()
                console.log("Payment completed successfully:", details)

                // Clear the cart after successful payment
                clearCart()
                setIsProcessing(false)

                // Call success callback with transaction ID
                onSuccess?.(details.id)
              } catch (error) {
                console.error("Payment capture error:", error)
                setIsProcessing(false)
                onError?.(error)
              }
            },
            onError: (err: any) => {
              console.error("PayPal error:", err)
              setIsProcessing(false)
              onError?.(err)
            },
            onCancel: (data: any) => {
              console.log("Payment cancelled:", data)
              setIsProcessing(false)
            },
            style: {
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
              height: 40,
            },
          })
          .render(paypalRef.current)
      } else {
        // PayPal SDK not loaded yet, check again
        setTimeout(checkPayPal, 100)
      }
    }

    checkPayPal()
  }, [items, total, clearCart, onSuccess, onError])

  // Don't render if no items in cart
  if (items.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading PayPal...</span>
        </div>
      )}

      {isProcessing && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Processing payment...</span>
          </div>
        </div>
      )}

      <div ref={paypalRef} className="w-full relative" />
    </div>
  )
}
