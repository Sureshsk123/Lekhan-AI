import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class RewardsPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            rewardList: '~list_rewards',
            rewardItemPrefix: 'android=new UiSelector().descriptionContains("', // Dynamic selector for specific items
            claimButton: '~btn_claim_reward',
            redeemButton: '~btn_redeem_reward'
        };
    }

    async selectReward(rewardName) {
        logger.info(`Selecting reward: ${rewardName}`);
        const selector = `${this.selectors.rewardItemPrefix}${rewardName}")`;
        await this.clickElement(selector);
    }

    async purchaseReward() {
        logger.info('Attempting to purchase/claim reward');
        await this.clickElement(this.selectors.claimButton);
    }

    async redeemReward() {
        logger.info('Attempting to redeem reward');
        await this.clickElement(this.selectors.redeemButton);
    }
}
