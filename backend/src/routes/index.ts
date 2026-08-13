import { Router } from 'express';
import authRouter from './authRoutes';
import documentRouter from './documentRoutes';

const router = Router();

router.use('/auth', authRouter);
router.use('/documents', documentRouter);

export default router;