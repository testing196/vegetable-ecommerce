#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

// PayPal API endpoint and headers (these won't change)
const PAYPAL_API_URL = 'https://www.msmaster.qa.paypal.com/ncp/api/button';
const HEADERS = {
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Origin': 'https://www.msmaster.qa.paypal.com',
  'Referer': 'https://www.msmaster.qa.paypal.com/ncp/cart/create?force_phase_2=true',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  'X-Requested-With': 'fetch',
  'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
  'sec-ch-ua-arch': '"arm"',
  'sec-ch-ua-bitness': '"64"',
  'sec-ch-ua-full-version': '"138.0.7204.184"',
  'sec-ch-ua-full-version-list': '"Not)A;Brand";v="8.0.0.0", "Chromium";v="138.0.7204.184", "Google Chrome";v="138.0.0.0"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-model': '""',
  'sec-ch-ua-platform': '"macOS"',
  'sec-ch-ua-platform-version': '"15.6.0"',
  'sec-ch-ua-wow64': '?0',
  'traceparent': '00-0000000000000000bac47c452d356b78-5a2fb74d161979c8-01',
  'tracestate': 'dd=s:1;o:rum',
  'x-csrf-token': 'apQvb2z5rNCuwFIvTWYJ4CddfaNOsVjJS53WQ=',
  'x-datadog-origin': 'rum',
  'x-datadog-parent-id': '6498614329030048200',
  'x-datadog-sampling-priority': '1',
  'x-datadog-trace-id': '13458018223042947960'
};

// Cookies (these won't change)
const COOKIES = 'Apache=10.183.35.80.1753000281239874; cookie_check=yes; d_id=889189a99ff5424494aa209c00ac84cf1753095941224; TLTDID=67486896575888115684511552817527; UGZUWCKM6F_awXE8WyEURJrBYQG=GZJju-PLJYzIVgWnG-vpN9T6pPfhlaLO2CBkRjDSJ9TuBunOvtWT2XTNBkLPQSmZx8Sd0eOSzL1QJLg8; cookie_prefs=T%3D1%2CP%3D1%2CF%3D1%2Ctype%3Dexplicit_banner; navlns=0.0; pi_opt_in925803=true; l7_geo=MSMASTER; _gcl_au=1.1.737929714.1754035697; ab.storage.userId.3857a778-c3a3-4c2a-9edc-0f0fe025894c=%7B%22g%22%3A%22PRBQR9MAHMDL6%22%2C%22c%22%3A1754064805963%2C%22l%22%3A1754064805965%7D; ab.storage.sessionId.3857a778-c3a3-4c2a-9edc-0f0fe025894c=%7B%22g%22%3A%22779829d9-6fb4-ced6-5fc7-e88feabc57b5%22%2C%22e%22%3A1754066744827%2C%22c%22%3A1754064805964%2C%22l%22%3A1754064944827%7D; s_pers=%20s_fid%3D628D94CAB252F8DB-000CCE9450772BC8%7C1817265785412%3B%20gpv_c43%3Dpaypal%253Aerror%253Aabort%253A%253A2%7C1754195585414%3B%20tr_p1%3Dpaypal%253Aerror%253Aabort%253A%253A2%7C1754195585415%3B%20gpv_events%3Dno%2520value%7C1754195585416%3B; KHcl0EuY7AKSMgfvHl7J5E7hPtK=GPqQFjlpjMG72BSleTu9ROM2XMwTHoDxo1uTUR01ObIWIAA_5Y2d99jpPOqjqVlBawZP7l6xOcbNC4bT; sc_f=KHNPjd7NktZgbz27chsk1FKIpFrrY0G5IVNbiBK3dwPjtEmgqkscU9vJPjY3aMBgWrH6f__t_7NGcfINDURId2XUkroXxtZDOj27wm; navcmd=_home; x-pp-p=AAJH9BlWrFnjmwl1Kn4VNzXDz2vqzjJ5UKNXcREgw64kJVYQZdrJWQyf3sGPRTa8qDPvdv1JIpwrYf4nSW-SpipoUHjr0FyefX1OdxG5p7o20-NrQIF3Z6OrIs.SZDK2ClDBUZCIwIRrF214yL5ItJEmAct7HQY0CKS3-uAZ0oAdOEuM8xPGuV.cc2w-YQ; _ga_YHGDKL1XT2=GS2.1.s1755582907$o15$g1$t1755582943$j24$l0$h0; visitor_id925803-hash=e9b9ebef0712350219a4972e240bcce81a0abab8d12d60ae82e5c6f10b8e8262b263db6130eead309cd091ea5edec2bfb42362d7; visitor_id925803=3773615132; enforce_policy=ccpa; TLTSID=67303715560910118021241807078742; cap_dt=wa_optn%3D5%253A1756622108918; sc_f_qa=8_yd0lpQqUqvmpJKJ8oMxsebln1MusqlPE2WUskVZB8d6opgxeZzrUtkG33rp3r3aqV1cuIBlahdheFnKcYkNPPvWnPTSm6jRyumD0; -1ILhdyICORs4hS4xTUr41S8iP0=rKkwYhMrb3-zmwDY8WctQE_XQwGqWF1NshT-yGBOY6KwWR5fAenpON_HC6n5eGsQAHxGk3uzsOFu4y6f; ddi_qa=PhK1jeki9hZjFy9MJ6mU0EOsp76u2UdGisIDwBdkeksVCf1AawcSaAWMgdBxsems2Cto4yrEkymo0gyC58ruIex-H2ikTUwrDqw_WXYFiloY_kWL; ddi=bzxO3i82A4YaBsdqg4tJRfMXBwTChGDXb0a7jcEeebQPlqT4iDCEgRSFJgsbRxOBotT03-t_r8GtOBxJpiSXHv86QzH4nFBGdYz9384DIdUBC7kj; _iidt=oyF3XVwu946pgN6OdLjMUh08KeaO12RQUiWZM1bG/ap7E2ENCOZDJAk8jPBnx95Tia848xhdanFzbKIaXrTJYAyOwsCvIr1+zu8b5YQ=; _ga_FQYH6BLY4K=GS1.1.1755676129.6.1.1755678635.0.0.0; kndctr_5CE4123F5245B06C0A490D45_AdobeOrg_identity=CiY5MDUyMjI4MDkzOTMyMDk0NTY5NjUxNDkwMTQ4ODEzMTYzOTA4NlIRCNTXz%2BaCMxgBKgRJUkwxMALwAaKsq%2BiMMw%3D%3D; x-csrf-jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6InpaT2FSbVFmZnEwVVlvVy1iLVhIS2ptel9uT3BJYjRQSFd4S3ZDbFpzWEJWcV9qNVFJbi1uSjRkcFJoQXBkNzNEelBSWkgtV3AyQmxKdUgxNFZ1WDh4dFNxb1cyWF93TGVHSEdSaUZjaDBPZDJDUTVKSEg1N2M1VEs4NGZpdW1FV3RybXN0YzF6d2t3eHA2eXFOdjZMdzNLcUp0RTYxTEFXT0xUcExRZzc0OEJUYS1EdWJrTFVKb1BaNnEiLCJpYXQiOjE3NTU3ODY3ODcsImV4cCI6MTc1NTc5MDM4N30.yoR-oD8KQ7t6ZA_DeyORb482v9yhXwNtypEj3gS2aaM; LANG=en_US%3BUS; _gid=GA1.2.1333330071.1755838838; _ga=GA1.1.253881043.1753159329; nsid=s%3AuXJcjvLBE35BX94698Lvz-_jnOd6zoyp.oZbB%2FdpEaGm99A6ntx%2F0tBIDB1zMaIl1v9vMzTaImjA; _ga_12GGBZX842=GS1.1.1755844932.74.1.1755845844.39.0.0; l7_az=msmaster.core; ts_c=vr%3D83d10e151980acaa1be955ceff3f8d6d%26vt%3Dd0dce7e11980a92a3a98bc41fee9bfe2; rssk=d%7DC9%40%3B8%3D%3A49%3A7%3AA%3C%3Exqx%3Enho%C2%82le%7Cr%3F13; datadome=umudFQ0zqRXIp7S~bLPK88nu6jX53ph~Sq0BQR2ClJmRPeBX7eWrlqcumU7PQcdQVlRPGeGZf_~5JYePIHDdCWgYpF9DQ0mS~SyyQ83~F5HS3frX9IRtsleaToYv7u2G; login_email=dottool-seller-3000479649350079%40paypal.com; id_token=idtokene9942c1aed4f4f3ca057701cc93cbe8e; MalRsA8UDHjgmVe-IcdklClEf2O=vxjGLAhbal4phB3QHDp_mG1WjGX71IRo2_xqK-EW9hpON9sCTCogia1FE4s-AdisOfkIlyuXXNnLyyjLppBUb03NSrS2vrt_E7QlD9nxOAy8NSbQXyUX53w6jTjbPkiik0K1OK5mZTKutQgZBJsmJLqKhBlnTSqduHKQsTwwVbqrbfB8_hRUbVVNSKe; 2wb88U-CV4AkfDGGwOy0H47CRfJUrIjP=; BX6gN0xMFKlwcZromLzVqK3ytR4=S23_A.AAeJ7c94vguMtolO0VvGOxPvoHjf9jwir9EO2BR9wJsy3iycMrFeaGB-lga3cHHilnWDOaJe6TJ6LGC993vthe_p5DnJcg; ui_experience=login_type%3DEMAIL_PASSWORD%26home%3D3%26did_set%3Dtrue%26login_preference%3Dpassword_login; fn_dt=291854df029b4a77b92d65504edf030e; TVKbnJIgoopqCTftP3PCeQTrLnu=honI1bHzudmCZ_QZqhas7iA7v3KE1AUKfg8BDBQcg42fR3-EHQ6VtxJDdEcIhb6Zq4H7uEhTawQoLczX2Z9ReaSoRovkNAmVoCHrB_3ge-HloMRwHnTl12y1V0WS2tVJZM7nwm; rmuc=ez9DxadCJhDgJyTWLRorTnblSpicSI4MxunAEjPeMSHo0qR_9DawjD2AXhyZmUnVE5EK65uubLQFz07sAW1NRPDpWnwyH3sQN8mzlmYM00hrbdKQVELZBiPIAdBe5P_2lJwj309wfCzIW66XWP-CyBtPtqDN5HlqvlFGCh90S4kEh0JJ-Wx6yMFxnJfTr3o3SKdlRNcCm0aBugUbH-Ikp61C3nfH_cnuQBoEGQgi-vLnY3je; X-PP-ADS=AToBTWulaLOqgcCPS4QxDUgWusYGFJw7AW8tp2jCpo-VQl5mRXkUWaMwh7PSOwFFKKhoIFvHvtNAsLtOhp0UvT.aMQ; tsrce=smartchatnodeweb; x-pp-s=eyJ0IjoiMTc1NTg1MTY3MzIzMSIsImwiOiIwIiwibSI6IjAifQ; ts=vreXpYrS%3D1787387691%26vteXpYrS%3D1755853491%26vr%3D83d10e151980acaa1be955ceff3f8d6d%26vt%3Dd0dce7e11980a92a3a98bc41fee9bfe2%26vtyp%3Dreturn; _dd_s=aid=fw5wl1qx6e&rum=2&id=c3f69286-befd-4dca-94d9-0fde9487239c&created=1755850798347&expire=1755852596234; tcs=main%3Abusiness%3Aweb%3Ahostedcheckout%7Cbutton_%3Ar0%3A';

// Fixed values that won't change
const FIXED_VALUES = {
  buttonVariation: "ADD_TO_CART",
  imagesToUpdate: [],
  paymentCategoryType: "CART",
  button_type: "FIXED_PRICE",
  currency_code: "USD",
  shipping: "",
  shipping1: "",
  shipping2: "",
  enableHandling: false,
  handling: "",
  tax_rate: "",
  memo_label: "",
  mandate_customer_memo: false,
  product_id: "",
  payment_button_type: "BUTTON",
  return_url_type: "no_return_url",
  custom_return_url: "",
  no_shipping: "2",
  single_button_custom_text: "",
  enableVariants: false,
  enablePricePerVariant: false,
  variants: [],
  enableDiscounts: false,
  enableQuantity: true,
  enable_inventory: false,
  allow_sold_out: false,
  sold_out_url: "",
  product_inventory: [],
  variant_inventory: []
};

function buildCurlCommand(productData) {
  const requestBody = {
    ...FIXED_VALUES,
    ...productData
  };

  const dataRaw = JSON.stringify(requestBody);
  
  let curlCommand = `curl '${PAYPAL_API_URL}' \\\n`;
  
  // Add headers
  Object.entries(HEADERS).forEach(([key, value]) => {
    curlCommand += `  -H '${key}: ${value}' \\\n`;
  });
  
  // Add cookies
  curlCommand += `  -b '${COOKIES}' \\\n`;
  
  // Add data
  curlCommand += `  --data-raw '${dataRaw}'`;
  
  return curlCommand;
}

function extractDataId(response) {
  try {
    const jsonResponse = JSON.parse(response);
    if (jsonResponse.button && jsonResponse.button.id) {
      return jsonResponse.button.id;
    }
    console.log('❌ No button.id found in response');
    console.log('Response structure:', JSON.stringify(jsonResponse, null, 2));
    return null;
  } catch (error) {
    console.log('❌ Failed to parse response as JSON');
    console.log('Raw response:', response);
    return null;
  }
}

function getUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n🚀 PayPal Button Generator\n');
    console.log('Enter the following product details:\n');
    
    rl.question('💰 Amount (e.g., 5.99): ', (amount) => {
      rl.question('📝 Product Description: ', (description) => {
        rl.question('🏷️  Item Name: ', (itemName) => {
          rl.question('🔢 Quantity Option (e.g., 10): ', (quantityOption) => {
            rl.close();
            resolve({
              amount: amount.trim(),
              product_description: description.trim(),
              item_name: itemName.trim(),
              quantity_option: quantityOption.trim()
            });
          });
        });
      });
    });
  });
}

async function main() {
  try {
    const productData = await getUserInput();
    
    console.log('\n📋 Product Details:');
    console.log(`Amount: $${productData.amount}`);
    console.log(`Description: ${productData.product_description}`);
    console.log(`Item Name: ${productData.item_name}`);
    console.log(`Quantity Option: ${productData.quantity_option}`);
    
    console.log('\n🔄 Generating PayPal button...\n');
    
    // Build the curl command
    const curlCommand = buildCurlCommand(productData);
    
    console.log('📜 Generated cURL command:');
    console.log('=' .repeat(80));
    console.log(curlCommand);
    console.log('=' .repeat(80));
    
    console.log('\n⏳ Executing cURL command...');
    
    // Execute the curl command
    const response = execSync(curlCommand, { encoding: 'utf8' });
    
    console.log('\n✅ Response received!');
    console.log('📊 Extracting data-id...\n');
    
    // Extract the data-id
    const dataId = extractDataId(response);
    
    if (dataId) {
      console.log('🎉 SUCCESS! PayPal Button ID:');
      console.log('=' .repeat(50));
      console.log(`data-id: ${dataId}`);
      console.log('=' .repeat(50));
      
      console.log('\n💡 Use this ID in your PayPal button:');
      console.log(`<paypal-add-to-cart-button data-id="${dataId}"></paypal-add-to-cart-button>`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('curl: command not found')) {
      console.log('\n💡 Make sure curl is installed on your system');
    }
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { buildCurlCommand, extractDataId }; 