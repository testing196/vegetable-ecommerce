import { NextResponse } from 'next/server';

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

export async function POST(request: Request) {
  try {
    const { items, total, intent = 'CAPTURE' } = await request.json();

    // For now, if items/total are not provided, use demo data
    const orderData = {
      intent: intent === 'AUTHORIZE' ? 'AUTHORIZE' : 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total || '29.99',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: total || '29.99',
              },
            },
          },
          items: items || [
            {
              name: 'Organic Vegetables',
              description: 'Fresh organic vegetables',
              quantity: '1',
              unit_amount: {
                currency_code: 'USD',
                value: '29.99',
              },
            },
          ],
        },
      ],
      application_context: {
        brand_name: 'VeggieFresh',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`,
      },
    };

    try {
      const accessToken = await generateAccessToken();
      const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal API error:', errorData);
        return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
      }

      const order = await response.json();
      return NextResponse.json({ id: order.id });
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in create-order API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}