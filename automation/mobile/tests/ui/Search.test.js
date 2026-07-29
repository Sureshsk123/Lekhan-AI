import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { SearchPage } from '../../pages/dashboard/SearchPage.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('UI Automation: Search Component Suite', function () {
    let flowManager;
    let compatibilityManager;
    let searchPage;

    before(async function () {
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
        flowManager = new FlowManager(global.driver);
        searchPage = new SearchPage(global.driver);
    });

    beforeEach(async function () {
        logger.info(`Starting UI Test: ${this.currentTest.title}`);
        // Ensure user is logged in
        if (!flowManager.context.isAuthenticated()) {
            await flowManager.login({ email: 'student@lekhan.ai', password: 'ValidPass123!' });
        }
        // Navigate to search
        await flowManager.navManager.gotoDashboard();
        await global.driver.click('~icon_global_search');
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        // Return to Dashboard to reset state
        await compatibilityManager.back(); 
    });

    it('should validate exact full match search', async function () {
        await searchPage.search('Automation Framework');
        
        await RetryUtility.retry(async () => {
            const firstResult = await searchPage.getElement(`${searchPage.selectors.searchResultItem}0`);
            assert.ok(await firstResult.isDisplayed(), 'Full match search returned no results');
        }, 2, 1000);
    });

    it('should validate partial match search', async function () {
        await searchPage.search('Auto');
        
        await RetryUtility.retry(async () => {
            const firstResult = await searchPage.getElement(`${searchPage.selectors.searchResultItem}0`);
            assert.ok(await firstResult.isDisplayed(), 'Partial match search returned no results');
        }, 2, 1000);
    });

    it('should validate case insensitive search', async function () {
        await searchPage.search('aUtOmAtIoN');
        
        await RetryUtility.retry(async () => {
            const firstResult = await searchPage.getElement(`${searchPage.selectors.searchResultItem}0`);
            assert.ok(await firstResult.isDisplayed(), 'Case insensitive search failed');
        }, 2, 1000);
    });

    it('should display empty state for no results', async function () {
        await searchPage.search('THIS_WILL_NEVER_EXIST_123');
        
        // Assert empty state icon or text appears
        // Using native UIAutomator selector since we don't have an EmptyState POM
        const emptyState = await global.driver.$('~img_empty_state_search');
        assert.ok(await emptyState.isDisplayed(), 'Empty state did not render for 0 results');
    });

    it('should allow clearing the search field', async function () {
        const input = await searchPage.getElement(searchPage.selectors.searchInput);
        await input.setValue('Testing');
        
        // Tap the native 'X' clear button inside the search component
        const clearBtn = await global.driver.$('~btn_clear_search');
        await clearBtn.click();
        
        assert.strictEqual(await input.getText(), 'Search...', 'Search input was not cleared to placeholder');
    });
});
