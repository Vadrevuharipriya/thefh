import express from 'express';
import requireAdmin from '../middleware/requireAdmin.js';
import * as ctrl from '../controllers/panelUsersController.js';

const router = express.Router();

router.get('/', requireAdmin, ctrl.getAdminPanelUsers);
router.get('/:id', requireAdmin, ctrl.getPanelUserById);
router.post('/', requireAdmin, ctrl.createPanelUser);
router.put('/:id', requireAdmin, ctrl.updatePanelUser);
router.delete('/:id', requireAdmin, ctrl.deletePanelUser);

export default router;
