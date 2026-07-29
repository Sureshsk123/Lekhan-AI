import ShopItem from '../models/ShopItem.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';

class ShopRepository {
    async getCatalog() {
        return await ShopItem.find({ isDeleted: false }).sort({ price: 1 }).lean();
    }

    async findItemById(itemId) {
        return await ShopItem.findOne({ itemId, isDeleted: false });
    }

    async createItem(itemData) {
        return await ShopItem.create(itemData);
    }

    async updateItem(itemId, updateData) {
        return await ShopItem.findOneAndUpdate({ itemId, isDeleted: false }, updateData, { new: true });
    }

    async deleteItem(itemId) {
        return await ShopItem.findOneAndUpdate({ itemId }, { isDeleted: true, deletedAt: new Date() }, { new: true });
    }

    async recordPurchase(userId, itemId, itemType, price) {
        return await Purchase.create({
            userId,
            itemId,
            itemType,
            price
        });
    }

    async getPurchasesByUser(userId) {
        return await Purchase.find({ userId, isDeleted: false }).sort({ purchasedAt: -1 }).lean();
    }
}

export default new ShopRepository();
