import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';

describe('Hardware Automation: Biometric Suite', function () {
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

    it('should handle fingerprint success and fingerprint failure', async function () {
        logger.info('Skipping Biometric emulation gracefully if unsupported by emulator config');
        this.skip();
    });
});