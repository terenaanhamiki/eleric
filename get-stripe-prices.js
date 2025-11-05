/**
 * Quick script to get Stripe Price IDs from Product IDs
 * 
 * Setup:
 * 1. Create a .env file with:
 *    STRIPE_SECRET_KEY=your_stripe_test_key_here
 *    STRIPE_PRO_PRODUCT_ID=your_pro_product_id
 *    STRIPE_ENTERPRISE_PRODUCT_ID=your_enterprise_product_id
 * 2. Run: node get-stripe-prices.js
 */

require('dotenv').config();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRO_PRODUCT_ID = process.env.STRIPE_PRO_PRODUCT_ID;
const STRIPE_ENTERPRISE_PRODUCT_ID = process.env.STRIPE_ENTERPRISE_PRODUCT_ID;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
  console.log('Please add STRIPE_SECRET_KEY=your_stripe_test_key to your .env file');
  process.exit(1);
}

if (!STRIPE_PRO_PRODUCT_ID || !STRIPE_ENTERPRISE_PRODUCT_ID) {
  console.error('❌ Stripe Product IDs not found in environment variables');
  console.log('Please add STRIPE_PRO_PRODUCT_ID and STRIPE_ENTERPRISE_PRODUCT_ID to your .env file');
  process.exit(1);
}

const PRODUCT_IDS = {
  pro: STRIPE_PRO_PRODUCT_ID,
  enterprise: STRIPE_ENTERPRISE_PRODUCT_ID
};

async function getPriceIds() {
  console.log('🔍 Fetching Price IDs from Stripe...\n');

  for (const [tier, productId] of Object.entries(PRODUCT_IDS)) {
    try {
      const response = await fetch(
        `https://api.stripe.com/v1/prices?product=${productId}&active=true`,
        {
          headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
          }
        }
      );

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const price = data.data[0];
        console.log(`✅ ${tier.toUpperCase()} Plan:`);
        console.log(`   Product ID: ${productId}`);
        console.log(`   Price ID: ${price.id}`);
        console.log(`   Amount: $${price.unit_amount / 100}/${price.recurring.interval}`);
        console.log(`   \n   Add to .env:`);
        console.log(`   STRIPE_PRICE_ID_${tier.toUpperCase()}=${price.id}\n`);
      } else {
        console.log(`❌ ${tier.toUpperCase()}: No active prices found for ${productId}\n`);
      }
    } catch (error) {
      console.error(`❌ Error fetching ${tier}:`, error.message);
    }
  }
}

getPriceIds();
