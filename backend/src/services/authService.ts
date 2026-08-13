import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { env } from '../config/env';
import { LoginRequestBody, AuthResponseData } from '../types';

export class AuthService {

  static async login(body: LoginRequestBody): Promise<AuthResponseData> {

    const { email, password } = body;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenantId },
      env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
      },
    };
    
  }
}