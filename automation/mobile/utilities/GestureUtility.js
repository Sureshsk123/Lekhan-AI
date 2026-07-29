import { CompatibilityManager } from '../drivers/CompatibilityManager.js';
import { logger } from './LoggerUtility.js';

export class GestureUtility {
    constructor(driver) {
        this.driver = driver;
    }

    async tap(element) {
        logger.info(`Tapping element`);
        await element.click();
    }

    async swipe(startX, startY, endX, endY, duration = 1000) {
        logger.info(`Swiping from (${startX}, ${startY}) to (${endX}, ${endY})`);
        await this.compatibilityManager.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: duration, origin: 'viewport', x: endX, y: endY },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
    }

    async scrollIntoView(elementText) {
        logger.info(`Scrolling to element with text: ${elementText}`);
        const selector = \`new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("\${elementText}"))\`;
        return await this.driver.$(\`android=\${selector}\`);
    }
}
