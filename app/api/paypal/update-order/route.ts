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

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, operations } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    if (!operations || !Array.isArray(operations)) {
      return NextResponse.json({ error: 'Patch operations are required as an array' }, { status: 400 });
    }
    
    try {
      const accessToken = await generateAccessToken();
      
      console.log('Sending PATCH with operations:', JSON.stringify(operations, null, 2));
      
      // Update order using PATCH with JSON Patch format
      const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(operations),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PayPal API error:', errorText);
        return NextResponse.json({ 
          error: 'Failed to update order',
          details: errorText
        }, { status: response.status });
      }

      // For successful PATCH operations, PayPal returns an empty response with 204 status
      // Get the updated order details to return to the client
      const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!orderResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          message: 'Order updated successfully, but could not retrieve updated details'
        });
      }
      
      const updatedOrder = await orderResponse.json();
      
      return NextResponse.json({
        success: true,
        message: 'Order updated successfully',
        order: updatedOrder
      });
      
    } catch (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in update-order API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}