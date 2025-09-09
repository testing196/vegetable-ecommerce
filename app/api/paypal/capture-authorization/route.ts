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

// Capture an authorized payment
export async function POST(request: NextRequest) {
  try {
    const { authorizationId, amount, finalCapture = true, invoiceId } = await request.json();
    
    if (!authorizationId) {
      return NextResponse.json({ error: 'Authorization ID is required' }, { status: 400 });
    }
    
    // Prepare capture data
    const captureData: any = {
      final_capture: finalCapture
    };
    
    // Add amount if provided (for partial captures)
    if (amount) {
      captureData.amount = {
        currency_code: 'USD',
        value: amount
      };
    }
    
    // Add invoice ID if provided
    if (invoiceId) {
      captureData.invoice_id = invoiceId;
    }
    
    try {
      const accessToken = await generateAccessToken();
      
      // Capture the authorized payment
      const response = await fetch(`${PAYPAL_API_URL}/v2/payments/authorizations/${authorizationId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(captureData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal API error:', errorData);
        return NextResponse.json({ error: 'Failed to capture authorized payment' }, { status: response.status });
      }

      const captureDetails = await response.json();
      
      return NextResponse.json({
        success: true,
        capture: captureDetails
      });
      
    } catch (error) {
      console.error('Error capturing authorized payment:', error);
      return NextResponse.json({ error: 'Failed to capture authorized payment' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in capture-authorization API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}