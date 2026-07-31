import { prisma } from '../server';
import { AppError } from '../middlewares/errorHandler';

export class ShopService {
  async getCatalog(category: string) {
    const where = category && category !== 'all'
      ? { category }
      : undefined;

    const items = await prisma.reward.findMany({
      where,
      orderBy: { cost: 'asc' }
    });

    return items;
  }

  async purchaseItem(userId: string, rewardId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const item = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (!item) throw new AppError('Item not found', 404);

    // Check if already purchased
    const existing = await prisma.userReward.findFirst({ where: { userId, rewardId } });
    if (existing) throw new AppError('Item already owned', 400);

    // Check free items (badges, etc)
    if (item.cost > 0 && user.coins < item.cost) {
      throw new AppError(`Not enough coins. You have ${user.coins} coins, need ${item.cost}.`, 400);
    }

    // Process purchase in transaction
    await prisma.$transaction([
      ...(item.cost > 0 ? [
        prisma.user.update({
          where: { id: userId },
          data: { coins: { decrement: item.cost } }
        })
      ] : []),
      prisma.userReward.create({
        data: { userId, rewardId }
      })
    ]);

    return {
      success: true,
      message: `"${item.name}" purchased successfully!`,
      coinsSpent: item.cost
    };
  }

  async getUserInventory(userId: string) {
    const userRewards = await prisma.userReward.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' }
    });
    return userRewards.map(ur => ({ ...ur.reward, purchasedAt: ur.redeemedAt }));
  }

  async equipItem(userId: string, rewardId: string) {
    const userReward = await prisma.userReward.findFirst({ where: { userId, rewardId } });
    if (!userReward) throw new AppError('You do not own this item', 403);

    const item = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (!item) throw new AppError('Item not found', 404);

    // Update the appropriate user field based on category
    const updateData: Record<string, string> = {};
    if (item.category === 'avatars') updateData.avatarUrl = item.icon || item.name;
    if (item.category === 'frames')  updateData.frameId  = item.id;
    if (item.category === 'titles')  updateData.title    = item.name;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: updateData });
    }

    return { success: true, message: `"${item.name}" equipped!`, item };
  }
}

export const shopService = new ShopService();
