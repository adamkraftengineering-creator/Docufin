import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  tenantId: string;
}

export interface AuthenticatedRequest<
  P = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: JwtPayload;
}

export interface ControllerResult<T> {
  status?: number;
  data: T;
}

export interface ErrorResponseData {
  error: string;
}