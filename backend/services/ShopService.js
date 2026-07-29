import ShopRepository from '../repositories/ShopRepository.js';
import UserRepository from '../repositories/UserRepository.js';

class ShopService {
    async getCatalog(user) {
        const catalog = await ShopRepository.getCatalog();
        return catalog.map(item => ({
            ...item,
            isOwned: user.inventory ? user.inventory.some(owned => owned.itemId === item.itemId) : false
        }));
    }

    async purchaseItem(user, itemId) {
        const item = await ShopRepository.findItemById(itemId);
        if (!item) {
            throw { status: 404, message: 'Item not found in catalog' };
        }

        if (user.inventory && user.inventory.some(owned => owned.itemId === itemId)) {
            throw { status: 400, message: 'Item already owned' };
        }

        if (user.diamonds < item.price) {
            throw { status: 400, message: 'Not enough diamonds' };
        }

        const newDiamonds = user.diamonds - item.price;
        const purchaseRecord = {
            itemId,
            itemType: item.category,
            purchasedAt: new Date()
        };

        const updatedUser = await UserRepository.update(user._id, {
            diamonds: newDiamonds,
            $push: { inventory: purchaseRecord }
        });

        await ShopRepository.recordPurchase(user._id, itemId, item.category, item.price);

        return {
            message: `Successfully purchased ${item.name}!`,
            diamonds: updatedUser.diamonds,
            inventory: updatedUser.inventory
        };
    }

    async getInventory(user) {
        const catalog = await ShopRepository.getCatalog();
        const catalogMap = new Map(catalog.map(i => [i.itemId, i]));

        return (user.inventory || []).map(owned => ({
            ...owned,
            details: catalogMap.get(owned.itemId) || null
        }));
    }

    async equipItem(user, itemId) {
        const ownedItem = (user.inventory || []).find(i => i.itemId === itemId);
        if (!ownedItem) {
            throw { status: 403, message: 'Item not owned' };
        }

        const item = await ShopRepository.findItemById(itemId);
        if (!item) {
            throw { status: 404, message: 'Catalog item not found' };
        }

        const updateFields = {};
        if (item.category === 'avatars') {
            updateFields.avatar = item.emoji;
        } else if (item.category === 'themes') {
            updateFields.activeTheme = item.itemId;
        } else if (item.category === 'titles') {
            updateFields.activeTitle = item.name;
        }

        const updatedUser = await UserRepository.update(user._id, updateFields);

        return {
            message: `${item.name} equipped!`,
            user: {
                avatar: updatedUser.avatar,
                activeTheme: updatedUser.activeTheme,
                activeTitle: updatedUser.activeTitle
            }
        };
    }
}

export default new ShopService();
