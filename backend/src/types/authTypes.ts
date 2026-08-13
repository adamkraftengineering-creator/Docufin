export interface UserDto {
  id: string;
  email: string;
  tenantId: string;
}

export interface AuthResponseData {
  token: string;
  user: UserDto;
}

export interface LoginRequestBody {
  email?: string;
  password?: string;
}