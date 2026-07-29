import apiClient from './apiClient';

export const getShopCatalog = async (category) => {
  const res = await apiClient.get('/shop/catalog', { params: { category } });
  return res.data;
};

export const purchaseShopItem = async (itemId) => {
  const res = await apiClient.post('/shop/purchase', { itemId });
  return res.data;
};

export const getUserInventory = async () => {
  const res = await apiClient.get('/shop/inventory');
  return res.data;
};

export const equipShopItem = async (itemId, itemType) => {
  const res = await apiClient.post('/shop/equip', { itemId, itemType });
  return res.data;
};

export default {
  getShopCatalog,
  purchaseShopItem,
  getUserInventory,
  equipShopItem
};
