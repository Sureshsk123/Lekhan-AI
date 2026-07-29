import ShopService from '../services/ShopService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getCatalog = async (req, res) => {
    try {
        const catalog = await ShopService.getCatalog(req.user);
        return sendSuccess(res, 200, 'Catalog retrieved successfully', { catalog }, { catalog });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const purchaseItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        const result = await ShopService.purchaseItem(req.user, itemId);
        return sendSuccess(res, 200, result.message, result, {
            diamonds: result.diamonds,
            inventory: result.inventory
        });
    } catch (error) {
        return sendError(res, error.status || 500, error.message);
    }
};

export const getInventory = async (req, res) => {
    try {
        const inventory = await ShopService.getInventory(req.user);
        return sendSuccess(res, 200, 'Inventory retrieved successfully', { inventory }, { inventory });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const equipItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        const result = await ShopService.equipItem(req.user, itemId);
        return sendSuccess(res, 200, result.message, result, {
            user: result.user
        });
    } catch (error) {
        return sendError(res, error.status || 500, error.message);
    }
};
