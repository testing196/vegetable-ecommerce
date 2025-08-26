import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Script from "next/script"
import { PayPalButtons } from "@/components/paypal-buttons"

export const metadata: Metadata = {
  title: "VeggieFresh - Organic Vegetables",
  description: "Fresh organic vegetables delivered to your door",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        
        {/* PayPal Cart SDK - Exactly as PayPal suggests */}
        <Script
          // src="https://www.paypal.com/ncp/js/embedded/cart.js"
          src="https://www.paypalobjects.com/ncp/sb/cart/cart.js"
          data-merchant-id="UR72V6GE5FWDQ"
          strategy="beforeInteractive"
        />
        
        {/* PayPal Buttons Component - Injects the exact HTML from PayPal image */}
        <PayPalButtons />
      </body>
    </html>
  )
}
