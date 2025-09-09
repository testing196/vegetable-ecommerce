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

// Authorize an order (reserve funds)
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    try {
      const accessToken = await generateAccessToken();
      
      console.log(`Attempting to authorize order: ${orderId}`);
      
      // Authorize payment for the order
      const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/authorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = await response.text();
        }
        
        console.error(`PayPal API error (${response.status}):`, errorData);
        return NextResponse.json({ 
          error: 'Failed to authorize payment', 
          details: errorData,
          status: response.status
        }, { status: response.status });
      }

      const authorizationDetails = await response.json();
      
      return NextResponse.json({
        success: true,
        authorization: authorizationDetails
      });
      
    } catch (error) {
      console.error('Error authorizing payment:', error);
      return NextResponse.json({ error: 'Failed to authorize payment' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in authorize API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get authorization details
export async function GET(request: NextRequest) {
  try {
    // Get authorizationId from query parameters
    const { searchParams } = new URL(request.url);
    const authorizationId = searchParams.get('authorizationId');
    
    if (!authorizationId) {
      return NextResponse.json({ error: 'Authorization ID is required' }, { status: 400 });
    }
    
    try {
      const accessToken = await generateAccessToken();
      
      // Get authorization details from PayPal
      const response = await fetch(`${PAYPAL_API_URL}/v2/payments/authorizations/${authorizationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal API error:', errorData);
        return NextResponse.json({ error: 'Failed to get authorization details' }, { status: response.status });
      }

      const authorizationDetails = await response.json();
      
      return NextResponse.json(authorizationDetails);
    } catch (error) {
      console.error('Error getting authorization details:', error);
      return NextResponse.json({ error: 'Failed to get authorization details' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in get-authorization API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}