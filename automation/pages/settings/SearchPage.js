import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';
import { SearchComponents } from '../components/SearchComponents.js';

export class SearchPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.search = new SearchComponents(driver);
        this.locators = {
            searchResultItem: By.css('.search-result, .result-card'),
            noResultsMessage: By.css('.no-results')
        };
    }

    async executeSearch(query) {
        await this.search.searchFor(query);
    }

    async getResultCount() {
        const elements = await this.driver.findElements(this.locators.searchResultItem);
        return elements.length;
    }

    async hasNoResultsMessage() {
        return await this.actions.isDisplayed(this.locators.noResultsMessage);
    }
}
