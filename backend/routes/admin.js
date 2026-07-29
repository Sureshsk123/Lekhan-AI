import express from 'express';
import protect from '../middleware/auth.js';
import { requireRole } from '../middleware/roleAuth.js';
import {
  getAdminDashboard,
  getAdminUsers,
  updateUserRole
} from '../controllers/adminController.js';
import { validateRoleUpdate, validateAdminUserQuery } from '../validators/adminValidator.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', validateAdminUserQuery, getAdminUsers);
router.put('/users/:userId/role', validateRoleUpdate, updateUserRole);

export default router;
