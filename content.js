// Content script for detecting spending pages and merchant information
class ContentScript {
  constructor() {
    this.merchantDetector = new MerchantDetector();
    this.init();
  }

  init() {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getMerchantInfo') {
        this.handleGetMerchantInfo(sendResponse);
        return true; // Will respond asynchronously
      }
    });

    // Detect merchant on page load
    this.detectMerchant();
  }

  async detectMerchant() {
    try {
      const merchantInfo = await this.merchantDetector.detectMerchant();
      if (merchantInfo) {
        // Store merchant info for popup
        this.currentMerchant = merchantInfo;
        
        // Send to background script
        chrome.runtime.sendMessage({
          action: 'merchantDetected',
          merchant: merchantInfo
        });
      }
    } catch (error) {
      console.error('Failed to detect merchant:', error);
    }
  }

  handleGetMerchantInfo(sendResponse) {
    if (this.currentMerchant) {
      sendResponse({ merchant: this.currentMerchant });
    } else {
      // Try to detect merchant again
      this.merchantDetector.detectMerchant()
        .then(merchantInfo => {
          sendResponse({ merchant: merchantInfo });
        })
        .catch(error => {
          console.error('Failed to get merchant info:', error);
          sendResponse({ merchant: null });
        });
    }
  }
}

// Initialize content script
const contentScript = new ContentScript();
