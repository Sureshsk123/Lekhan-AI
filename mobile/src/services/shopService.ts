import apiClient from './apiClient';
import { ShopItem } from '../types';

export const getShopCatalog = async (category?: string): Promise<ShopItem[]> => {
  const res = await apiClient.get('/shop/catalog', { params: { category } });
  return res.data.catalog || res.data.items || res.data.data || [];
};

export const purchaseShopItem = async (itemId: string): Promise<any> => {
  const res = await apiClient.post('/shop/purchase', { itemId });
  return res.data;
};

export const getUserInventory = async (): Promise<ShopItem[]> => {
  const res = await apiClient.get('/shop/inventory');
  return res.data.inventory || res.data.items || res.data.data || [];
};

export const equipShopItem = async (itemId: string, itemType: string): Promise<any> => {
  const res = await apiClient.post('/shop/equip', { itemId, itemType });
  return res.data;
};

export default {
  getShopCatalog,
  purchaseShopItem,
  getUserInventory,
  equipShopItem,
};
