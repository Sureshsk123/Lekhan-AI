import { CommonActions } from '../utilities/CommonActions.js';
import { logger } from '../utilities/LoggerUtility.js';

export class BasePage {
    constructor(driver) {
        this.driver = driver;
        this.actions = new CommonActions(driver);
    }
}
