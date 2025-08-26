# PayPal Button Generator Script

This script automates the process of generating PayPal "Add to Cart" buttons by making API calls to PayPal's button creation endpoint.

## 🚀 How to Use

### 1. Run the Script
```bash
cd scripts
node generate-paypal-button.js
```

### 2. Enter Product Details
The script will prompt you for:
- **Amount**: Price in USD (e.g., 5.99)
- **Product Description**: Brief description of the product
- **Item Name**: Name of the product
- **Quantity Option**: Maximum quantity available (e.g., 10)

### 3. Get Your PayPal Button ID
The script will:
- Generate the appropriate cURL command
- Execute it automatically
- Extract the `data-id` from PayPal's response
- Display the result

## 📋 Example Usage

```bash
$ node generate-paypal-button.js

🚀 PayPal Button Generator

Enter the following product details:

💰 Amount (e.g., 5.99): 3.99
📝 Product Description: Fresh, organic broccoli crowns rich in vitamins
🏷️  Item Name: Organic Broccoli
🔢 Quantity Option (e.g., 10): 10

📋 Product Details:
Amount: $3.99
Description: Fresh, organic broccoli crowns rich in vitamins
Item Name: Organic Broccoli
Quantity Option: 10

🔄 Generating PayPal button...

📜 Generated cURL command:
================================================================================
curl 'https://www.msmaster.qa.paypal.com/ncp/api/button' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  ... (more headers)
  --data-raw '{"buttonVariation":"ADD_TO_CART",...}'
================================================================================

⏳ Executing cURL command...

✅ Response received!
📊 Extracting data-id...

🎉 SUCCESS! PayPal Button ID:
==================================================
data-id: ABC123XYZ789
==================================================

💡 Use this ID in your PayPal button:
<paypal-add-to-cart-button data-id="ABC123XYZ789"></paypal-add-to-cart-button>
```

## 🔧 What the Script Does

1. **Takes your input**: Only the essential product details you need to change
2. **Uses fixed values**: All the authentication, headers, and technical settings are pre-configured
3. **Generates cURL**: Creates the exact cURL command needed
4. **Executes automatically**: Runs the command and gets the response
5. **Extracts data-id**: Parses PayPal's response to get the button ID
6. **Shows result**: Displays the ID and how to use it

## 📝 Requirements

- Node.js installed
- `curl` command available in your system
- Valid PayPal authentication (already configured in the script)

## 🎯 Use Cases

- Generate buttons for new products
- Update existing product buttons
- Batch create multiple product buttons
- Test different product configurations

## ⚠️ Notes

- The script uses your existing PayPal authentication details
- All technical parameters are pre-configured for "Add to Cart" buttons
- The script automatically handles all the complex cURL formatting
- You only need to provide the 4 essential product details 