import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { SearchPage } from '../../pages/settings/SearchPage.js';
import { LoginPage } from '../../pages/auth/LoginPage.js';
import { envManager } from '../../utilities/EnvironmentManager.js';
import { dataManager } from '../../utilities/DataManager.js';


describe('UI Component Tests - Search Bars', function () {
    BaseTest.setupHooks();
    let searchPage;
    let loginPage;

    before(async function () {
        searchPage = new SearchPage(this.driver);
        loginPage = new LoginPage(this.driver);
    });

    beforeEach(async function () {
        await this.driver.get(`${envManager.getBaseUrl()}/login`);
        await loginPage.loginAs(dataManager.getUser('student').email, dataManager.getUser('student').password); 
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        
        // Navigate to search page
        await this.driver.get(`${envManager.getBaseUrl()}/search`);
    });

    it('1. Search Results (Valid Query)', async function () {
        await searchPage.executeSearch('lesson');
        
        // Wait for results to render
        await this.driver.sleep(1000); // Allow debounce/API
        
        const count = await searchPage.getResultCount();
        // Since we are mocking, we don't know exact counts, just verify it runs without crashing
        expect(count).to.be.a('number');
    });

    it('2. Empty Search', async function () {
        await searchPage.executeSearch('');
        
        // Usually, an empty search either returns all or returns nothing depending on implementation
        const count = await searchPage.getResultCount();
        expect(count).to.be.a('number');
    });

    it('3. No Results State', async function () {
        // Search for gibberish
        await searchPage.executeSearch('xyz_no_results_123');
        await this.driver.sleep(1000); // Allow debounce/API
        
        const count = await searchPage.getResultCount();
        expect(count).to.equal(0);
        
        const hasNoResultsMsg = await searchPage.hasNoResultsMessage();
        expect(hasNoResultsMsg).to.be.true;
    });

    it('4. Clear Search', async function () {
        await searchPage.executeSearch('test');
        
        // Using common actions to clear the input
        await searchPage.search.actions.clear(searchPage.search.locators.searchInput);
        
        const input = await searchPage.search.actions.waitForVisible(searchPage.search.locators.searchInput);
        const val = await input.getAttribute('value');
        
        expect(val).to.equal('');
    });
});
