import { request } from '@umijs/max';

export async function queryMenuList() {
  return request<Menu.MenuListApi>('/api/menus', {
    method: 'GET',
  });
}

export async function addMenu(params: Menu.MenuInfo) {
  return request<Common.Result>('/api/menu', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMenu(params: Menu.MenuInfo) {
  return request<Common.Result>(`/api/menu/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function deleteMenu(params: Menu.MenuInfo) {
  return request<Common.Result>(`/api/menu/${params.id}`, {
    method: 'DELETE',
  });
}
