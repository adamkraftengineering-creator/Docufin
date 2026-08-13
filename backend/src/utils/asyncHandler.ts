import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, ControllerResult } from '../types';

export const createHandler = <T>( fn: (req: AuthenticatedRequest<any, any, any, any>) => Promise<ControllerResult<T>> ) => {

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

      const result = await fn(req as AuthenticatedRequest);
      res.status(result.status || 200).json(result.data);

    } catch (error: any) {
      
      const isNotFound = error.message && error.message.toLowerCase().includes('not found');
      const status = isNotFound ? 404 : 400;
      res.status(status).json({ error: error.message || 'An error occurred' });
    }
  };
};