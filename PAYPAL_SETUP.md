# PayPal Cart Integration - Simple Setup

This guide shows how to set up PayPal's Cart system using exactly what they recommend.

## What We've Implemented

✅ **PayPal Cart SDK** - Loaded in layout  
✅ **Add to Cart Buttons** - For individual products  
✅ **View Cart Button** - In the header  
✅ **Simple Integration** - Just like PayPal suggests  

## Setup Steps

### 1. Get Your PayPal Merchant ID

1. Go to [PayPal Business Dashboard](https://business.paypal.com/)
2. Navigate to **Tools** → **PayPal Buttons**
3. Create a new "Shopping Cart" button
4. Copy the **Merchant ID** from the generated code

### 2. Update the Layout

Edit `app/layout.tsx` and replace `YOUR_MERCHANT_ID_HERE` with your actual Merchant ID:

```typescript
<Script
  src="https://www.paypal.com/ncp/js/embedded/cart.js"
  data-merchant-id="YOUR_ACTUAL_MERCHANT_ID"
  strategy="beforeInteractive"
/>
```

### 3. Test

1. Run `npm run dev`
2. Visit `/demo` to test the cart functionality
3. Try adding products and viewing the cart

## How It Works

- **Add to Cart**: Click "Add to Cart" → Item goes to PayPal's cart
- **View Cart**: Click cart button in header → PayPal's cart opens
- **Checkout**: Seamless PayPal checkout flow

## Code Structure

The implementation uses exactly what PayPal suggests:

```html
<!-- In layout.tsx -->
<script src="https://www.paypal.com/ncp/js/embedded/cart.js" data-merchant-id="YOUR_ID"></script>

<!-- In product cards -->
<paypal-add-to-cart-button data-id="add-to-cart-1"></paypal-add-to-cart-button>
<script>cartPaypal.AddToCart({ id: "add-to-cart-1" })</script>

<!-- In header -->
<paypal-cart-button data-id="pp-view-cart"></paypal-cart-button>
<script>cartPaypal.Cart({ id: "pp-view-cart" })</script>
```

That's it! Simple and exactly as PayPal recommends. 