// Rewards calculation logic
class RewardsCalculator {
  static calculateBestCard(merchant, userCards) {
    if (!merchant || !userCards || userCards.length === 0) {
      return [];
    }

    // Calculate reward rate for each card
    const cardRewards = userCards.map(card => {
      const rewardRate = this.getRewardRate(card, merchant.category);
      return {
        card,
        rewardRate,
        category: merchant.category
      };
    });

    // Sort by reward rate (highest first)
    cardRewards.sort((a, b) => b.rewardRate - a.rewardRate);

    return cardRewards;
  }

  static getRewardRate(card, merchantCategory) {
    const rewards = card.rewards || {};
    
    // Map merchant categories to card reward categories
    const categoryMap = {
      'dining': 'dining',
      'restaurants': 'dining',
      'food': 'dining',
      'gas': 'gas',
      'fuel': 'gas',
      'groceries': 'groceries',
      'grocery': 'groceries',
      'supermarket': 'groceries',
      'travel': 'travel',
      'hotel': 'travel',
      'airline': 'travel',
      'online': 'online',
      'ecommerce': 'online',
      'shopping': 'online'
    };

    const rewardCategory = categoryMap[merchantCategory.toLowerCase()] || 'other';
    return rewards[rewardCategory] || rewards.other || 0;
  }

  static calculatePotentialRewards(amount, rewardRate) {
    return (amount * rewardRate) / 100;
  }

  static compareCards(merchant, userCards, purchaseAmount = 100) {
    const recommendations = this.calculateBestCard(merchant, userCards);
    
    return recommendations.map(rec => ({
      ...rec,
      potentialRewards: this.calculatePotentialRewards(purchaseAmount, rec.rewardRate)
    }));
  }
}
