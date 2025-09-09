'use client'

import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'

export default function CheckoutCancelPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">Payment Cancelled</h1>
          
          <div className="p-4 border border-border rounded-lg bg-card mb-6">
            <p className="text-muted-foreground mb-2">
              Your payment was cancelled. No charges were made to your account.
            </p>
            <p className="text-muted-foreground">
              If you experienced any issues during checkout, please try again or contact our support team.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Return to Homepage
            </Button>
            
            <Button 
              onClick={() => router.back()}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}