'use client'

import { useState } from 'react'
// Temporarily commented out PayPal SDK imports
import { 
  PayPalScriptProvider, 
  PayPalButtons,
  FUNDING 
} from '@paypal/react-paypal-js'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'


const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
const PAYPAL_OPTIONS = {
  clientId: PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture'
}

// Types
interface Product {
  id: number
  name: string
  price: number
  quantity: number
}

interface PayPalCheckoutProps {
  products: Product[]
  intent?: 'CAPTURE' | 'AUTHORIZE'
  onSuccess?: (orderData: any) => void
  onError?: (error: any) => void
}

export function PayPalCheckout({ 
  products = [], 
  intent = 'CAPTURE',
  onSuccess, 
  onError 
}: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false)

  // Calculate order total
  const orderTotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity, 
    0
  ).toFixed(2)

  // Create order via server API
  const createOrder = async () => {
    setLoading(true)
    try {
      // Format product items for PayPal
      const items = products.map(product => ({
        name: product.name,
        quantity: product.quantity.toString(),
        unit_amount: {
          currency_code: 'USD',
          value: product.price.toFixed(2)
        }
      }))

      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          total: orderTotal,
          intent
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await response.json()
      return orderData.id
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Could not create PayPal order')
      if (onError) onError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Capture payment after approval
  const onApprove = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderID: data.orderID
        })
      })

      if (!response.ok) {
        throw new Error('Failed to capture order')
      }

      const orderData = await response.json()
      
      // Success notification
      toast.success('Payment completed successfully!')
      
      // Call success callback if provided
      if (onSuccess) onSuccess(orderData)
      
      return orderData
    } catch (error) {
      console.error('Error capturing order:', error)
      toast.error('Payment processing failed')
      if (onError) onError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Simulate PayPal flow with a dummy button
  // const handleDummyCheckout = async () => {
  //   try {
  //     setLoading(true)
      
  //     // Step 1: Create order
  //     const orderId = await createOrder()
      
  //     // Step 2: Simulate approval
  //     console.log('Order created with ID:', orderId)
      
  //     // Step 3: Capture the order
  //     const orderData = await onApprove({ orderID: orderId })
      
  //     return orderData
  //   } catch (error) {
  //     console.error('Dummy checkout error:', error)
  //     toast.error('Checkout process failed')
  //     if (onError) onError(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Processing payment...</span>
        </div>
      )}
      
      <PayPalScriptProvider options={PAYPAL_OPTIONS}>
        <PayPalButtons
          disabled={loading || products.length === 0}
          forceReRender={[products, orderTotal]}
            fundingSource={FUNDING.PAYPAL}
            style={{
              layout: 'vertical',
              shape: 'rect',
              color: 'blue'
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(error) => {
              console.error('PayPal error:', error)
              toast.error('PayPal error occurred')
              if(onError) onError(error)
              }}
            />
      </PayPalScriptProvider>
    </div>
  )
}