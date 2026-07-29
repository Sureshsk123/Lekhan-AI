export class DevicePool {
    constructor() {
        this.registry = new Map();
    }

    registerDevice(device) {
        this.registry.set(device.id, { ...device, status: 'AVAILABLE', currentSession: null, workerId: null });
    }

    getAvailableDevice(filters) {
        for (let [id, device] of this.registry) {
            if (device.status === 'AVAILABLE' && this._matchesFilters(device, filters)) {
                return device;
            }
        }
        return null;
    }

    _matchesFilters(device, filters) {
        if (filters.platform && device.platform !== filters.platform) return false;
        return true;
    }

    markBusy(deviceId, workerId, sessionId) {
        const device = this.registry.get(deviceId);
        if (device) {
            device.status = 'BUSY';
            device.workerId = workerId;
            device.currentSession = sessionId;
        }
    }

    release(deviceId) {
        const device = this.registry.get(deviceId);
        if (device) {
            device.status = 'AVAILABLE';
            device.workerId = null;
            device.currentSession = null;
        }
    }
    
    markDead(deviceId) {
        const device = this.registry.get(deviceId);
        if (device) device.status = 'DEAD';
    }
}