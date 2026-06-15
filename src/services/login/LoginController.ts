import { request } from '@umijs/max';

export type LoginParams = {
  username: string;
  password: string;
};

export async function login(params: LoginParams) {
  return request<Common.Result<string>>('/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
  return request<Common.Result>('/logout', {
    method: 'GET',
  });
}
