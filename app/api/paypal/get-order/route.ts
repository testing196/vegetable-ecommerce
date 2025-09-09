import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_API_URL = process.env.NEXT_PUBLIC_PAYPAL_API_URL || '';

// Generate an access token for PayPal API
async function generateAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`PayPal token request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate PayPal access token:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get orderId from query parameters
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    try {
      const accessToken = await generateAccessToken();
      
      // Get order details from PayPal
      const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal API error:', errorData);
        return NextResponse.json({ error: 'Failed to get order details' }, { status: response.status });
      }

      const orderDetails = await response.json();
      
      // Return the order details to the client
      return NextResponse.json(orderDetails);
    } catch (error) {
      console.error('Error getting order details:', error);
      return NextResponse.json({ error: 'Failed to get order details' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in get-order API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}