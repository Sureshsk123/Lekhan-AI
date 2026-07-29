import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class AITutorPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            chatInput: '~input_chat_message',
            sendButton: '~btn_send_chat',
            chatHistoryList: '~list_chat_history',
            lastMessageBubble: '//android.view.ViewGroup[@content-desc="chat_bubble"][last()]'
        };
    }

    async sendChatMessage(message) {
        logger.info(`Sending AI Tutor message: ${message}`);
        await this.enterText(this.selectors.chatInput, message);
        await this.clickElement(this.selectors.sendButton);
    }

    async getLastResponse() {
        logger.info('Fetching last AI response');
        return await this.getText(this.selectors.lastMessageBubble);
    }
}
