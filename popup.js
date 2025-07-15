class PopupManager {
  constructor() {
    this.currentView = 'loading';
    this.currentMerchant = null;
    this.userCards = [];
    this.init();
  }

  async init() {
    await this.loadUserCards();
    this.setupEventListeners();
    await this.checkCurrentPage();
  }

  async loadUserCards() {
    try {
      this.userCards = await Storage.getCards();
    } catch (error) {
      console.error('Failed to load user cards:', error);
      this.userCards = [];
    }
  }

  setupEventListeners() {
    // Navigation buttons
    document.getElementById('add-cards-btn')?.addEventListener('click', () => {
      this.showView('card-management');
    });

    document.getElementById('manage-cards-btn')?.addEventListener('click', () => {
      this.showView('card-management');
    });

    document.getElementById('add-card-btn')?.addEventListener('click', () => {
      this.showView('add-card-form');
    });

    document.getElementById('cancel-add')?.addEventListener('click', () => {
      this.showView('card-management');
    });

    // Card form submission
    document.getElementById('card-form')?.addEventListener('submit', (e) => {
      this.handleCardFormSubmit(e);
    });

    // Show/hide other cards
    document.getElementById('best-card')?.addEventListener('click', () => {
      const otherCards = document.getElementById('other-cards');
      if (otherCards.style.display === 'none') {
        otherCards.style.display = 'block';
      } else {
        otherCards.style.display = 'none';
      }
    });
  }

  async checkCurrentPage() {
    try {
      // Get current tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];

      if (!tab) {
        this.showView('no-merchant');
        return;
      }

      // Get merchant info from content script
      const result = await chrome.tabs.sendMessage(tab.id, { action: 'getMerchantInfo' });
      
      if (result && result.merchant) {
        this.currentMerchant = result.merchant;
        this.showMerchantRecommendations();
      } else {
        this.showView('no-merchant');
      }
    } catch (error) {
      console.error('Failed to check current page:', error);
      this.showView('no-merchant');
    }
  }

  showMerchantRecommendations() {
    if (this.userCards.length === 0) {
      this.showView('no-cards');
      return;
    }

    // Calculate best card for this merchant
    const recommendations = RewardsCalculator.calculateBestCard(this.currentMerchant, this.userCards);
    
    // Show merchant info
    document.getElementById('merchant-name').textContent = this.currentMerchant.name;
    document.getElementById('merchant-category').textContent = this.currentMerchant.category;
    document.getElementById('merchant-info').style.display = 'block';

    // Show recommendations
    this.renderRecommendations(recommendations);
    this.showView('recommendations');
  }

  renderRecommendations(recommendations) {
    const bestCard = recommendations[0];
    const otherCards = recommendations.slice(1);

    // Render best card
    const bestCardElement = document.getElementById('best-card');
    bestCardElement.innerHTML = this.createCardRecommendationHTML(bestCard, true);

    // Render other cards
    const otherCardsListElement = document.getElementById('other-cards-list');
    otherCardsListElement.innerHTML = '';
    
    otherCards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card-recommendation other';
      cardElement.innerHTML = this.createCardRecommendationHTML(card, false);
      otherCardsListElement.appendChild(cardElement);
    });

    // Show/hide other cards section
    const otherCardsSection = document.getElementById('other-cards');
    if (otherCards.length > 0) {
      otherCardsSection.style.display = 'block';
    } else {
      otherCardsSection.style.display = 'none';
    }
  }

  createCardRecommendationHTML(recommendation, isBest) {
    const { card, rewardRate, category } = recommendation;
    const badgeClass = isBest ? 'best' : 'other';
    
    return `
      <div class="card-name">${card.name}</div>
      <div class="card-network">${card.network.toUpperCase()}</div>
      <div class="reward-info">
        <div class="reward-rate">${rewardRate}% back</div>
        <div class="reward-category">${category} rewards</div>
      </div>
    `;
  }

  async handleCardFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const cardData = {
      id: Date.now().toString(),
      name: document.getElementById('card-name').value,
      network: document.getElementById('card-network').value,
      rewards: {
        dining: parseFloat(document.getElementById('dining-rate').value) || 0,
        gas: parseFloat(document.getElementById('gas-rate').value) || 0,
        groceries: parseFloat(document.getElementById('groceries-rate').value) || 0,
        travel: parseFloat(document.getElementById('travel-rate').value) || 0,
        online: parseFloat(document.getElementById('online-rate').value) || 0,
        other: parseFloat(document.getElementById('other-rate').value) || 0
      }
    };

    try {
      await Storage.addCard(cardData);
      await this.loadUserCards();
      this.showSuccessMessage('Card added successfully!');
      this.showView('card-management');
      document.getElementById('card-form').reset();
    } catch (error) {
      console.error('Failed to add card:', error);
      this.showErrorMessage('Failed to add card. Please try again.');
    }
  }

  async deleteCard(cardId) {
    try {
      await Storage.deleteCard(cardId);
      await this.loadUserCards();
      this.showSuccessMessage('Card deleted successfully!');
      this.renderCardsList();
    } catch (error) {
      console.error('Failed to delete card:', error);
      this.showErrorMessage('Failed to delete card. Please try again.');
    }
  }

  showView(viewName) {
    // Hide all views
    const views = ['loading', 'merchant-info', 'recommendations', 'no-merchant', 'no-cards', 'card-management', 'add-card-form'];
    views.forEach(view => {
      const element = document.getElementById(view);
      if (element) {
        element.style.display = 'none';
      }
    });

    // Show specific view
    const targetView = document.getElementById(viewName);
    if (targetView) {
      targetView.style.display = 'block';
    }

    // Special handling for card management view
    if (viewName === 'card-management') {
      this.renderCardsList();
    }

    this.currentView = viewName;
  }

  renderCardsList() {
    const cardsListElement = document.getElementById('cards-list');
    cardsListElement.innerHTML = '';

    if (this.userCards.length === 0) {
      cardsListElement.innerHTML = '<p style="text-align: center; color: #6c757d; font-size: 12px;">No cards added yet.</p>';
      return;
    }

    this.userCards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card-item';
      cardElement.innerHTML = `
        <div class="card-item-info">
          <div class="card-item-name">${card.name}</div>
          <div class="card-item-network">${card.network.toUpperCase()}</div>
        </div>
        <div class="card-item-actions">
          <button class="btn btn-danger btn-small" onclick="popupManager.deleteCard('${card.id}')">
            Delete
          </button>
        </div>
      `;
      cardsListElement.appendChild(cardElement);
    });
  }

  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `${type}-message`;
    messageElement.textContent = message;

    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(messageElement, container.firstChild);

    // Remove message after 3 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }
}

// Initialize popup manager when DOM is loaded
let popupManager;
document.addEventListener('DOMContentLoaded', () => {
  popupManager = new PopupManager();
});
