import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class Tables extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            table: By.css('table'),
            tableHeaders: By.css('table th'),
            tableRows: By.css('table tbody tr'),
            cellInRow: (rowIndex, colIndex) => By.xpath(`(//table/tbody/tr)[${rowIndex}]/td[${colIndex}]`)
        };
    }

    async getRowCount() {
        const rows = await this.driver.findElements(this.locators.tableRows);
        return rows.length;
    }

    async getCellText(rowIndex, colIndex) {
        return await this.actions.getText(this.locators.cellInRow(rowIndex, colIndex));
    }
}
