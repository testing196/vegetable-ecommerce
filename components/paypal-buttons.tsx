"use client"

import { useEffect } from "react"

// Configuration for all PayPal buttons
const PAYPAL_BUTTONS_CONFIG = [
  {
    productId: 1,
    paypalButtonId: "6HHPD34LK3GMW",
    productName: "Tomatoes"
  },
  {
    productId: 2,
    paypalButtonId: "QF4JAPCKSZ972",
    productName: "Carrots"
  },
  {
    productId: 3,
    paypalButtonId: "A9ZZ7Y9AENR76",
    productName: "Spinach"
  },
  {
    productId: 4,
    paypalButtonId: "JP46X5AZGAB7A",
    productName: "Bell Peppers"
  },
  {
    productId: 5,
    paypalButtonId: "TUDF22T77PAYE",
    productName: "Organic Broccoli"
  },
  {
    productId: 6,
    paypalButtonId: "YYZSAERVFLBDC",
    productName: "Sweet Potatoes"
  },
  {
    productId: 7,
    paypalButtonId: "PPFCRBR5W59RG",
    productName: "Organic Lettuce"
  },
  {
    productId: 8,
    paypalButtonId: "8H2XH6LR4HV4C",
    productName: "Fresh Cucumbers"
  }
  // Add more products here as you get their PayPal button IDs
]

export function PayPalButtons() {
  useEffect(() => {
    const injectPayPalButtons = () => {
      if (typeof window !== 'undefined' && (window as any).cartPaypal) {
        console.log('PayPal loaded, injecting buttons...')
        
        // Inject View Cart button
        const viewCartContainer = document.getElementById('paypal-view-cart-container')
        if (viewCartContainer) {
          viewCartContainer.innerHTML = '<paypal-cart-button data-id="pp-view-cart"></paypal-cart-button>'
          ;(window as any).cartPaypal.Cart({ id: "pp-view-cart" })
          console.log('View Cart button injected')
        }

        // Inject Add to Cart buttons for all products
        PAYPAL_BUTTONS_CONFIG.forEach(({ productId, paypalButtonId, productName }) => {
          const container = document.getElementById(`paypal-add-to-cart-${productId}`)
          if (container) {
            container.innerHTML = `<paypal-add-to-cart-button data-id="${paypalButtonId}"></paypal-add-to-cart-button>`
            ;(window as any).cartPaypal.AddToCart({ id: paypalButtonId })
          }
        })
        
        // Debug: Check what was actually injected
        setTimeout(() => {
          PAYPAL_BUTTONS_CONFIG.forEach(({ productId, productName }) => {
            const container = document.getElementById(`paypal-add-to-cart-${productId}`)
            if (container) {
              console.log(`${productName} container HTML:`, container.innerHTML)
            }
          })
        }, 1000)
      }
    }

    // Check if PayPal is loaded, if not wait for it
    if (typeof window !== 'undefined' && (window as any).cartPaypal) {
      injectPayPalButtons()
    } else {
      console.log('Waiting for PayPal to load...')
      const checkPayPal = setInterval(() => {
        if (typeof window !== 'undefined' && (window as any).cartPaypal) {
          clearInterval(checkPayPal)
          console.log('PayPal loaded, injecting buttons...')
          injectPayPalButtons()
        }
      }, 100)
    }
  }, [])

  return null
} 