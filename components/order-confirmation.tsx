"use client"

import { CheckCircle, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderConfirmationProps {
  transactionId: string
  onClose: () => void
}

export function OrderConfirmation({ transactionId, onClose }: OrderConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl text-foreground">Order Confirmed!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Thank you for your purchase!</p>
            <p className="text-sm font-mono bg-muted px-3 py-2 rounded">Transaction ID: {transactionId}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Order Processing</p>
                <p className="text-xs text-muted-foreground">We're preparing your fresh vegetables</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm text-muted-foreground">Delivery</p>
                <p className="text-xs text-muted-foreground">Expected within 2-3 business days</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
