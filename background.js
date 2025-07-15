// Background script for Chrome extension
class BackgroundScript {
  constructor() {
    this.init();
  }

  init() {
    // Listen for messages from content scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'merchantDetected') {
        this.handleMerchantDetected(request.merchant, sender.tab);
      }
    });

    // Update badge when merchant is detected
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        this.resetBadge(tabId);
      }
    });
  }

  handleMerchantDetected(merchant, tab) {
    // Update extension badge to show merchant detected
    chrome.action.setBadgeText({
      text: '!',
      tabId: tab.id
    });

    chrome.action.setBadgeBackgroundColor({
      color: '#28a745',
      tabId: tab.id
    });

    // Store merchant info for this tab
    chrome.storage.local.set({
      [`merchant_${tab.id}`]: merchant
    });
  }

  resetBadge(tabId) {
    chrome.action.setBadgeText({
      text: '',
      tabId: tabId
    });
  }
}

// Initialize background script
const backgroundScript = new BackgroundScript();
