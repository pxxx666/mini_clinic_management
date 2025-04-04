import { request } from '@umijs/max';

export const register = async (data: API.RegisterDto) => {
  return request<API.IResponse<API.TokenResult>>('/api/auth/register', {
    method: 'POST',
    data,
  });
};

export const login = async (data: API.LoginDto) => {
  return request<API.IResponse<API.TokenResult>>('/api/auth/login', {
    method: 'POST',
    data,
  });
};

export const queryCurrentUser = async () => {
  return request<API.IResponse<API.UserVO>>('/api/auth/profile', {
    method: 'GET',
  });
};

export const queryCode = async (data: { email: string }) => {
  return request<API.IResponse<{ success: boolean }>>('/api/auth/send-verification-code', {
    method: 'POST',
    data,
  });
};
