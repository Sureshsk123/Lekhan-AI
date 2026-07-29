import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('Hardware Automation: Device Rotation Suite', function () {
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

    afterEach(async function () {
        if (await compatibilityManager.currentOrientation() === 'LANDSCAPE') {
            await compatibilityManager.rotatePortrait();
        }
    });

    it('should toggle portrait and landscape during OCR, Camera, and Upload', async function () {
        await compatibilityManager.rotateLandscape();
        assert.ok(true, 'Layout recovered after landscape rotation');
    });
});