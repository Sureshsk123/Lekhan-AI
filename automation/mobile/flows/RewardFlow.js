import { RewardsPage } from '../pages/dashboard/RewardsPage.js';
import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';
import { RetryUtility } from '../utilities/RetryUtility.js';
import { ScreenshotUtility } from '../utilities/ScreenshotUtility.js';

export class RewardFlow {
    constructor(driver, navManager, context) {
        this.driver = driver;
        this.navManager = navManager;
        this.context = context;

        this.rewardsPage = new RewardsPage(driver);
    }

    async openRewards() {
        this.context.startFlow('RewardFlow.openRewards');
        logger.info('[Flow] Opening Rewards section');

        try {
            // Assume rewards is accessed via Dashboard UI or specific DeepLink
            await this.navManager.gotoDashboard();
            logger.info('Tapping rewards shortcut from Dashboard');
            await this.driver.click('~icon_rewards_shortcut');
            
            this.context.completeFlow('RewardFlow.openRewards');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_OpenRewards_Failed');
            logger.error(`[Flow] Open Rewards failed: ${error.message}`);
            throw new Error(`RewardFlow.openRewards failed: ${error.message}`);
        }
    }

    async purchaseReward(item) {
        this.context.startFlow('RewardFlow.purchaseReward');
        logger.info(`[Flow] Executing Purchase Reward flow for: ${item}`);

        try {
            await this.openRewards();
            
            await RetryUtility.retry(async () => {
                await this.rewardsPage.selectReward(item);
                await this.rewardsPage.purchaseReward();
            }, 2, 1000);

            this.context.completeFlow('RewardFlow.purchaseReward');
            logger.info(`[Flow] Reward ${item} purchased successfully`);
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_PurchaseReward_Failed');
            logger.error(`[Flow] Purchase Reward failed: ${error.message}`);
            throw new Error(`RewardFlow.purchaseReward failed: ${error.message}`);
        }
    }

    async claimReward() {
        logger.info('[Flow] Claiming generic reward');
        await this.openRewards();
        await RetryUtility.retry(async () => {
            await this.rewardsPage.purchaseReward();
        }, 2, 1000);
    }

    async redeemReward() {
        logger.info('[Flow] Redeeming reward');
        await this.openRewards();
        await RetryUtility.retry(async () => {
            await this.rewardsPage.redeemReward();
        }, 2, 1000);
    }
}
