import api from '../api/axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  data: User;
  message: string;
}

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/api/auth/login', payload);
  return res.data;
};

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>('/api/auth/register', payload);
  return res.data;
};
