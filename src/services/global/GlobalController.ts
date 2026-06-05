import { request } from '@umijs/max';

export async function getCurrentUser() {
  return request<Common.MeApi>('/api/me', {
    method: 'GET',
  });
}

export async function getMenus() {
  return request<Common.MenuApi>('/api/me/menus', {
    method: 'GET',
  });
}
