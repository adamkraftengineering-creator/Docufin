import { Router } from 'express';
import { createHandler } from '../utils/asyncHandler';
import {
  getDocumentsController,
  createDocumentController,
  updateStatusController,
} from '../controllers/documentController';
import { authenticateJwt } from '../middleware/authMiddleware';

const documentRouter = Router();

documentRouter.use(authenticateJwt);

documentRouter.get('/', createHandler(getDocumentsController));
documentRouter.post('/', createHandler(createDocumentController));
documentRouter.patch('/:id/status', createHandler(updateStatusController));

export default documentRouter;