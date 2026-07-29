import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class AiTutorPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            chatInput: By.css('input[placeholder*="message"], textarea, .chat-input'),
            sendButton: By.css('button[type="submit"], .send-btn, button[aria-label="Send"]'),
            messageList: By.css('.message-list, .chat-messages'),
            lastMessage: By.xpath('(//*[contains(@class, "message")] | //*[contains(@class, "chat-bubble")])[last()]'),
            micButton: By.css('button[aria-label*="microphone"], .mic-btn')
        };
    }

    async sendMessage(message) {
        await this.actions.type(this.locators.chatInput, message);
        await this.actions.click(this.locators.sendButton);
    }

    async getLastMessageText() {
        return await this.actions.getText(this.locators.lastMessage);
    }

    async toggleMicrophone() {
        await this.actions.click(this.locators.micButton);
    }
}
