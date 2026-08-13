import { Router } from 'express';
import { createHandler } from '../utils/asyncHandler';
import { loginController } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/login', createHandler(loginController));

export default authRouter;