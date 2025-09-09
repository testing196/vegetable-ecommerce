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

// Void an authorized payment
export async function POST(request: NextRequest) {
  try {
    const { authorizationId } = await request.json();
    
    if (!authorizationId) {
      return NextResponse.json({ error: 'Authorization ID is required' }, { status: 400 });
    }
    
    try {
      const accessToken = await generateAccessToken();
      
      // Void the authorized payment
      const response = await fetch(`${PAYPAL_API_URL}/v2/payments/authorizations/${authorizationId}/void`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal API error:', errorData);
        return NextResponse.json({ error: 'Failed to void authorized payment' }, { status: response.status });
      }

      // For successful void operations, PayPal returns an empty response with 204 status
      
      return NextResponse.json({
        success: true,
        message: 'Authorization successfully voided'
      });
      
    } catch (error) {
      console.error('Error voiding authorized payment:', error);
      return NextResponse.json({ error: 'Failed to void authorized payment' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in void-authorization API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}