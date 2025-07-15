// Storage utility for managing credit card data
class Storage {
  static async getCards() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['creditCards'], (result) => {
        resolve(result.creditCards || []);
      });
    });
  }

  static async addCard(cardData) {
    const cards = await this.getCards();
    cards.push(cardData);
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ creditCards: cards }, () => {
        resolve();
      });
    });
  }

  static async updateCard(cardId, updatedData) {
    const cards = await this.getCards();
    const cardIndex = cards.findIndex(card => card.id === cardId);
    
    if (cardIndex !== -1) {
      cards[cardIndex] = { ...cards[cardIndex], ...updatedData };
      
      return new Promise((resolve) => {
        chrome.storage.local.set({ creditCards: cards }, () => {
          resolve();
        });
      });
    }
    
    throw new Error('Card not found');
  }

  static async deleteCard(cardId) {
    const cards = await this.getCards();
    const filteredCards = cards.filter(card => card.id !== cardId);
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ creditCards: filteredCards }, () => {
        resolve();
      });
    });
  }

  static async getMerchantInfo(tabId) {
    return new Promise((resolve) => {
      chrome.storage.local.get([`merchant_${tabId}`], (result) => {
        resolve(result[`merchant_${tabId}`] || null);
      });
    });
  }

  static async setMerchantInfo(tabId, merchantInfo) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [`merchant_${tabId}`]: merchantInfo }, () => {
        resolve();
      });
    });
  }

  static async clearMerchantInfo(tabId) {
    return new Promise((resolve) => {
      chrome.storage.local.remove([`merchant_${tabId}`], () => {
        resolve();
      });
    });
  }
}
