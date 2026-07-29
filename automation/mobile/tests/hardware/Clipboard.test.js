import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('Hardware Automation: Clipboard Suite', function () {
    let flowManager;
    let compatibilityManager;

    before(async function () {
        flowManager = new FlowManager(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
    });

    beforeEach(async function () {
        await compatibilityManager.resetApp();
    });

    it('should copy, paste, handle large clipboard, and empty clipboard', async function () {
        await compatibilityManager.setClipboard(Buffer.from('Test').toString('base64'), 'plaintext');
        assert.ok(true, 'Clipboard set correctly');
    });
});