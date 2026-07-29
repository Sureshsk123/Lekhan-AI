import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class HandwritingPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            canvas: By.css('canvas, .drawing-board'),
            clearButton: By.css('button:contains("Clear"), .clear-btn'),
            submitButton: By.css('button:contains("Submit"), button:contains("Check"), .submit-btn')
        };
    }

    async clearCanvas() {
        await this.actions.click(this.locators.clearButton);
    }

    async submitDrawing() {
        await this.actions.click(this.locators.submitButton);
    }

    async drawOnCanvas(offsetX = 50, offsetY = 50) {
        // Simple automation to drag and draw a line on the canvas
        const canvasElement = await this.actions.waitForVisible(this.locators.canvas);
        const actions = this.driver.actions({ bridge: true });
        await actions
            .move({ origin: canvasElement })
            .press()
            .move({ x: offsetX, y: offsetY, origin: 'pointer' })
            .release()
            .perform();
    }
}
