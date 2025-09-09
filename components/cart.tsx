'use client'

import { useState } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { PayPalCheckout } from '@/components/paypal-checkout'
import Image from 'next/image'
import { toast } from 'sonner'

export function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const [open, setOpen] = useState(false)
  
  const handlePaymentSuccess = (orderData: any) => {
    toast.success('Payment successful! Thank you for your order.')
    clearCart()
    setOpen(false)
  }
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b border-border">
                  <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.image || "/placeholder.svg"} 
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    <div className="flex items-center mt-1">
                      <button 
                        className="w-6 h-6 flex items-center justify-center bg-muted text-muted-foreground rounded"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        className="w-6 h-6 flex items-center justify-center bg-muted text-muted-foreground rounded"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      className="text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="border-t border-border pt-4 mt-auto">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              
              <div className="pt-2">
                <PayPalCheckout 
                  products={items} 
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => console.error('Payment error:', error)}
                />
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}