'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  
  // Get the order ID from query params
  const orderId = searchParams.get('token')
  
  // Clear the cart on successful payment
  useEffect(() => {
    clearCart()
  }, [clearCart])
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">Payment Successful!</h1>
          
          <div className="p-4 border border-border rounded-lg bg-card mb-6">
            <p className="text-muted-foreground mb-2">
              Thank you for your order. We have received your payment and will process your order shortly.
            </p>
            
            {orderId && (
              <p className="text-sm text-muted-foreground">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => router.push('/')}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}