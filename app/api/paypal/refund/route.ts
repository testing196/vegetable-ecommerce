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

export async function POST(request: NextRequest) {
  try {
    const { captureId, amount, note } = await request.json();
    
    if (!captureId) {
      return NextResponse.json({ error: 'Capture ID is required' }, { status: 400 });
    }
    
    // Prepare refund data
    const refundData: any = {};
    
    // Add amount if provided (for partial refunds)
    if (amount) {
      refundData.amount = {
        currency_code: 'USD',
        value: amount
      };
    }
    
    // Add note to payer if provided
    if (note) {
      refundData.note_to_payer = note;
    }
    
    try {
      const accessToken = await generateAccessToken();
      
      // Process refund
      const response = await fetch(`${PAYPAL_API_URL}/v2/payments/captures/${captureId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(refundData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal API error:', errorData);
        return NextResponse.json({ error: 'Failed to process refund' }, { status: response.status });
      }

      const refundDetails = await response.json();
      
      return NextResponse.json({
        success: true,
        refund: refundDetails
      });
      
    } catch (error) {
      console.error('Error processing refund:', error);
      return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in refund API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get refund details
export async function GET(request: NextRequest) {
  try {
    // Get refundId from query parameters
    const { searchParams } = new URL(request.url);
    const refundId = searchParams.get('refundId');
    
    if (!refundId) {
      return NextResponse.json({ error: 'Refund ID is required' }, { status: 400 });
    }
    
    try {
      const accessToken = await generateAccessToken();
      
      // Get refund details from PayPal
      const response = await fetch(`${PAYPAL_API_URL}/v2/payments/refunds/${refundId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal API error:', errorData);
        return NextResponse.json({ error: 'Failed to get refund details' }, { status: response.status });
      }

      const refundDetails = await response.json();
      
      return NextResponse.json(refundDetails);
    } catch (error) {
      console.error('Error getting refund details:', error);
      return NextResponse.json({ error: 'Failed to get refund details' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in get-refund API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}