# Smart Card Rewards Chrome Extension

A Chrome extension that detects when you're on spending pages and recommends the optimal credit card to use for maximum rewards.

## How to Test the Extension

### Step 1: Load the Extension in Chrome

1. Open Google Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right
4. Click "Load unpacked" button
5. Select the project folder (the folder containing `manifest.json`)
6. The extension should now appear in your extensions list

### Step 2: Set Up Your Credit Cards

1. Click the extension icon in the Chrome toolbar (blue credit card icon)
2. Click "Add Credit Cards" or "Manage Cards"
3. Click "Add New Card"
4. Fill in your card details:
   - Card name (e.g., "Chase Sapphire Preferred")
   - Network (Visa, Mastercard, etc.)
   - Reward rates for different categories (dining, gas, groceries, travel, online shopping, other)
5. Click "Save Card"
6. Repeat for all your credit cards

### Step 3: Test Merchant Detection

Visit any of these test websites to see the extension in action:

**E-commerce Sites:**
- amazon.com
- target.com
- walmart.com
- bestbuy.com

**Food Delivery:**
- doordash.com
- ubereats.com
- grubhub.com

**Travel Sites:**
- expedia.com
- booking.com
- airbnb.com

**Gas Stations:**
- shell.com
- chevron.com

### Step 4: Check Extension Response

1. When you visit a supported merchant site, the extension icon should show a green badge with "!"
2. Click the extension icon to see:
   - Detected merchant name and category
   - Recommended card for maximum rewards
   - Reward rate for that category
   - Other card options

### Step 5: Test on Unknown Sites

The extension also works on unknown shopping sites by detecting:
- Shopping cart pages
- Checkout pages
- Payment forms
- Product pages with "buy now" buttons

### Troubleshooting

**Extension not loading:**
- Make sure all files are in the same folder
- Check that `manifest.json` is in the root folder
- Refresh the extensions page and try again

**No merchant detected:**
- Make sure you're on a shopping/spending page
- Check browser console for any errors (F12 → Console)
- The extension looks for shopping indicators like "cart", "checkout", "buy now"

**No recommendations shown:**
- Make sure you've added at least one credit card
- Check that your cards have reward rates configured
- The extension matches merchant categories to your card's reward categories

### Features

- **Automatic Detection**: Recognizes 40+ major merchants and generic shopping sites
- **Smart Recommendations**: Calculates best card based on merchant category and your reward rates
- **Local Storage**: All data stays in your browser - no external servers
- **Privacy Focused**: No tracking or data collection
- **Easy Management**: Add, edit, and delete cards through the popup interface

### Categories Supported

- **Dining**: Restaurants, food delivery, dining out
- **Gas**: Gas stations, fuel purchases
- **Groceries**: Supermarkets, grocery stores
- **Travel**: Hotels, airlines, booking sites
- **Online Shopping**: E-commerce, retail websites
- **Other**: General purchases, miscellaneous spending

## Development Notes

This extension uses Chrome's Manifest V3 and requires these permissions:
- `activeTab`: To access current webpage content
- `storage`: To save your credit card data locally
- `scripting`: To inject content scripts for merchant detection

All processing happens locally in your browser for maximum privacy and security.