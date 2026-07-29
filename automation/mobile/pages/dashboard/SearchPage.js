import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class SearchPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            searchInput: '~input_global_search',
            searchSubmitIcon: '~icon_search_submit',
            searchResultList: '~list_search_results',
            searchResultItem: '~item_search_result_' // Indexed by ID appending later
        };
    }

    async search(query) {
        logger.info(`Performing global search for: ${query}`);
        await this.enterText(this.selectors.searchInput, query);
        await this.clickElement(this.selectors.searchSubmitIcon);
    }

    async selectSearchResult(index = 0) {
        logger.info(`Selecting search result at index: ${index}`);
        const selector = `${this.selectors.searchResultItem}${index}`;
        await this.clickElement(selector);
    }
}
