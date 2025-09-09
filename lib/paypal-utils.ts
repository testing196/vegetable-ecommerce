/**
 * PayPal API utility functions for vegetable-ecommerce
 */

// Types
interface PayPalItem {
  name: string;
  quantity: string;
  unit_amount: {
    currency_code: string;
    value: string;
  };
  description?: string;
}

interface CreateOrderOptions {
  items: PayPalItem[];
  total: string;
  intent?: 'CAPTURE' | 'AUTHORIZE';
}

/**
 * Creates a PayPal order
 */
export async function createOrder({ items, total, intent = 'CAPTURE' }: CreateOrderOptions) {
  try {
    const response = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items,
        total,
        intent
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const orderData = await response.json();
    return orderData.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Fetches details for a specific order
 */
export async function getOrderDetails(orderId: string) {
  try {
    const response = await fetch(`/api/paypal/get-order?orderId=${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get order details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting order details:', error);
    throw error;
  }
}

/**
 * Updates an existing order before payment
 * @param orderId PayPal order ID
 * @param operations Array of PATCH operations in JSON Patch format
 * 
 * Example operations:
 * [
 *   {
 *     "op": "replace",
 *     "path": "/purchase_units/@reference_id=='default'/amount",
 *     "value": {
 *       "currency_code": "USD",
 *       "value": "10.99",
 *       "breakdown": {
 *         "item_total": {
 *           "currency_code": "USD",
 *           "value": "10.99"
 *         }
 *       }
 *     }
 *   }
 * ]
 */
export async function updateOrder(orderId: string, operations: any[]) {
  try {
    const response = await fetch('/api/paypal/update-order', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId,
        operations
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

/**
 * Processes a refund for a captured payment
 * @param captureId The ID of the captured payment to refund
 * @param amount Optional amount to refund (for partial refunds)
 * @param note Optional note to the customer
 */
export async function refundPayment(captureId: string, amount?: string, note?: string) {
  try {
    const response = await fetch('/api/paypal/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        captureId,
        amount,
        note
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process refund');
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
}

/**
 * Gets details for a specific refund
 */
export async function getRefundDetails(refundId: string) {
  try {
    const response = await fetch(`/api/paypal/refund?refundId=${refundId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get refund details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting refund details:', error);
    throw error;
  }
}

/**
 * Authorizes payment for an order (reserving funds without capturing)
 */
export async function authorizePayment(orderId: string) {
  try {
    const response = await fetch('/api/paypal/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to authorize payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error authorizing payment:', error);
    throw error;
  }
}

/**
 * Gets details for a specific authorization
 */
export async function getAuthorizationDetails(authorizationId: string) {
  try {
    const response = await fetch(`/api/paypal/authorize?authorizationId=${authorizationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get authorization details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting authorization details:', error);
    throw error;
  }
}

/**
 * Captures an authorized payment
 */
export async function captureAuthorization(
  authorizationId: string, 
  amount?: string, 
  finalCapture: boolean = true,
  invoiceId?: string
) {
  try {
    const response = await fetch('/api/paypal/capture-authorization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authorizationId,
        amount,
        finalCapture,
        invoiceId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to capture authorized payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error capturing authorized payment:', error);
    throw error;
  }
}

/**
 * Voids an authorized payment
 */
export async function voidAuthorization(authorizationId: string) {
  try {
    const response = await fetch('/api/paypal/void-authorization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authorizationId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to void authorization');
    }

    return await response.json();
  } catch (error) {
    console.error('Error voiding authorization:', error);
    throw error;
  }
}