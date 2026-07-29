import ParentChildLink from '../models/ParentChildLink.js';
import User from '../models/User.js';

export const linkChild = async ({ parentId, childId, relationship = 'parent' }) => {
  return await ParentChildLink.findOneAndUpdate(
    { parentId, childId },
    { relationship, status: 'active' },
    { upsert: true, new: true }
  );
};

export const getChildrenByParentId = async (parentId) => {
  const links = await ParentChildLink.find({ parentId, status: 'active' })
    .populate('childId', 'username email xp level diamonds avatar streak created')
    .lean();

  return links.map(link => link.childId);
};

export const findLink = async (parentId, childId) => {
  return await ParentChildLink.findOne({ parentId, childId, status: 'active' });
};

export default {
  linkChild,
  getChildrenByParentId,
  findLink
};
