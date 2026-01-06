export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  name: string;
  email: string;
  roleName: string;
  token: string;
  message: string;
}

export interface UserData {
  userId: number;
  name: string;
  email: string;
  roleName: string;
  token: string;
}
