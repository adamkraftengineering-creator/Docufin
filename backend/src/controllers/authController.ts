import { AuthService } from '../services/authService';
import { AuthenticatedRequest, LoginRequestBody, AuthResponseData, ControllerResult } from '../types';

export const loginController = async (req: AuthenticatedRequest<{}, AuthResponseData, LoginRequestBody>): Promise<ControllerResult<AuthResponseData>> => {

  const data = await AuthService.login(req.body);
  
  return { status: 200, data };
};