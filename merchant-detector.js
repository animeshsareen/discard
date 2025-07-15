// Merchant detection logic
class MerchantDetector {
  constructor() {
    this.merchantPatterns = {
      // E-commerce sites
      'amazon.com': { name: 'Amazon', category: 'online' },
      'ebay.com': { name: 'eBay', category: 'online' },
      'walmart.com': { name: 'Walmart', category: 'groceries' },
      'target.com': { name: 'Target', category: 'groceries' },
      'bestbuy.com': { name: 'Best Buy', category: 'online' },
      'home-depot.com': { name: 'Home Depot', category: 'online' },
      'lowes.com': { name: "Lowe's", category: 'online' },
      'costco.com': { name: 'Costco', category: 'groceries' },
      'samsclub.com': { name: "Sam's Club", category: 'groceries' },
      'shopify.com': { name: 'Shopify Store', category: 'online' },
      
      // Food delivery
      'doordash.com': { name: 'DoorDash', category: 'dining' },
      'ubereats.com': { name: 'Uber Eats', category: 'dining' },
      'grubhub.com': { name: 'Grubhub', category: 'dining' },
      'postmates.com': { name: 'Postmates', category: 'dining' },
      'seamless.com': { name: 'Seamless', category: 'dining' },
      
      // Travel
      'expedia.com': { name: 'Expedia', category: 'travel' },
      'booking.com': { name: 'Booking.com', category: 'travel' },
      'airbnb.com': { name: 'Airbnb', category: 'travel' },
      'hotels.com': { name: 'Hotels.com', category: 'travel' },
      'kayak.com': { name: 'Kayak', category: 'travel' },
      'priceline.com': { name: 'Priceline', category: 'travel' },
      'united.com': { name: 'United Airlines', category: 'travel' },
      'delta.com': { name: 'Delta Airlines', category: 'travel' },
      'southwest.com': { name: 'Southwest Airlines', category: 'travel' },
      
      // Gas stations
      'shell.com': { name: 'Shell', category: 'gas' },
      'exxon.com': { name: 'Exxon', category: 'gas' },
      'chevron.com': { name: 'Chevron', category: 'gas' },
      'bp.com': { name: 'BP', category: 'gas' },
      'speedway.com': { name: 'Speedway', category: 'gas' },
      
      // Grocery stores
      'kroger.com': { name: 'Kroger', category: 'groceries' },
      'safeway.com': { name: 'Safeway', category: 'groceries' },
      'publix.com': { name: 'Publix', category: 'groceries' },
      'wholefoodsmarket.com': { name: 'Whole Foods', category: 'groceries' },
      'aldi.us': { name: 'Aldi', category: 'groceries' },
      'traderjoes.com': { name: "Trader Joe's", category: 'groceries' }
    };

    this.spendingIndicators = [
      // Shopping cart indicators
      'cart', 'bag', 'checkout', 'payment', 'buy now', 'add to cart',
      'shopping cart', 'shopping bag', 'proceed to checkout', 'place order',
      
      // Payment indicators
      'credit card', 'debit card', 'paypal', 'apple pay', 'google pay',
      'payment method', 'billing', 'total', 'subtotal', 'tax',
      
      // E-commerce indicators
      'price', '$', 'USD', 'buy', 'purchase', 'order', 'shipping',
      'delivery', 'quantity', 'size', 'color', 'add to wishlist',
      
      // Form indicators
      'payment-form', 'checkout-form', 'billing-form', 'order-form'
    ];
  }

  async detectMerchant() {
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const pageContent = document.body.innerText.toLowerCase();
    
    // Check if this is a known merchant
    const knownMerchant = this.checkKnownMerchant(hostname);
    if (knownMerchant) {
      // Verify it's a spending page
      if (this.isSpendingPage(pageContent, pathname)) {
        return knownMerchant;
      }
    }

    // Check for generic spending indicators
    if (this.isSpendingPage(pageContent, pathname)) {
      return this.detectGenericMerchant(hostname, pageContent);
    }

    return null;
  }

  checkKnownMerchant(hostname) {
    // Remove www. prefix
    const cleanHostname = hostname.replace(/^www\./, '');
    
    // Check exact match
    if (this.merchantPatterns[cleanHostname]) {
      return { ...this.merchantPatterns[cleanHostname] };
    }

    // Check for subdomain matches
    for (const pattern in this.merchantPatterns) {
      if (cleanHostname.includes(pattern)) {
        return { ...this.merchantPatterns[pattern] };
      }
    }

    return null;
  }

  isSpendingPage(pageContent, pathname) {
    // Check URL path for spending-related keywords
    const spendingPaths = [
      'cart', 'checkout', 'payment', 'buy', 'purchase', 'order',
      'billing', 'shop', 'store', 'product', 'item'
    ];

    const hasSpendingPath = spendingPaths.some(path => 
      pathname.includes(path)
    );

    // Check page content for spending indicators
    const hasSpendingIndicators = this.spendingIndicators.some(indicator => 
      pageContent.includes(indicator)
    );

    // Check for specific DOM elements
    const hasSpendingElements = this.checkSpendingElements();

    return hasSpendingPath || hasSpendingIndicators || hasSpendingElements;
  }

  checkSpendingElements() {
    // Check for common e-commerce elements
    const selectors = [
      'input[type="submit"][value*="buy"]',
      'button[class*="buy"]',
      'button[class*="cart"]',
      'button[class*="checkout"]',
      'button[class*="payment"]',
      'button[class*="purchase"]',
      'form[class*="checkout"]',
      'form[class*="payment"]',
      'div[class*="cart"]',
      'div[class*="checkout"]',
      'span[class*="price"]',
      'div[class*="price"]',
      '.shopping-cart',
      '.add-to-cart',
      '.checkout-button',
      '.buy-now',
      '.payment-form'
    ];

    return selectors.some(selector => {
      try {
        return document.querySelector(selector) !== null;
      } catch (e) {
        return false;
      }
    });
  }

  detectGenericMerchant(hostname, pageContent) {
    // Try to extract merchant name from page title or content
    const title = document.title;
    let merchantName = this.extractMerchantName(title, hostname);
    
    // Determine category based on content analysis
    const category = this.categorizeGenericMerchant(pageContent, hostname);
    
    return {
      name: merchantName,
      category: category
    };
  }

  extractMerchantName(title, hostname) {
    // Try to extract from page title
    if (title && title.length > 0) {
      // Remove common suffixes
      const cleanTitle = title
        .replace(/\s*-\s*.*$/, '') // Remove everything after dash
        .replace(/\s*\|\s*.*$/, '') // Remove everything after pipe
        .replace(/\s*:\s*.*$/, '') // Remove everything after colon
        .trim();
      
      if (cleanTitle.length > 0 && cleanTitle.length < 50) {
        return cleanTitle;
      }
    }

    // Fallback to hostname
    return hostname
      .replace(/^www\./, '')
      .replace(/\.[^.]+$/, '') // Remove TLD
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  categorizeGenericMerchant(pageContent, hostname) {
    const categoryKeywords = {
      'dining': ['restaurant', 'food', 'meal', 'dining', 'menu', 'delivery', 'takeout'],
      'gas': ['gas', 'fuel', 'station', 'petroleum', 'chevron', 'shell', 'exxon'],
      'groceries': ['grocery', 'supermarket', 'food', 'organic', 'fresh', 'produce'],
      'travel': ['hotel', 'flight', 'airline', 'booking', 'reservation', 'travel', 'vacation'],
      'online': ['shop', 'store', 'retail', 'buy', 'purchase', 'product', 'catalog']
    };

    const contentLower = pageContent.toLowerCase();
    const hostnameLower = hostname.toLowerCase();

    // Check each category
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const keywordMatches = keywords.filter(keyword => 
        contentLower.includes(keyword) || hostnameLower.includes(keyword)
      );
      
      if (keywordMatches.length >= 2) {
        return category;
      }
    }

    // Default to online if no specific category found
    return 'online';
  }
}
