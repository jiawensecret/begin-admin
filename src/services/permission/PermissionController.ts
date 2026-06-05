import { request } from '@umijs/max';

export async function getMenuPermission(
  menuId: number,
  params: {
    name?: string;
    code?: string;
  },
) {
  return request<Permission.MenuPermissionApi>(`/api/${menuId}/permissions`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getPermissions(
  menuId: number,
  params: {
    name?: string;
    code?: string;
    menu_id?: number;
  },
) {
  return request<Permission.MenuPermissionApi>(`/api/permissions`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function addPermission(params: Permission.PermissionInfo) {
  return request<Common.Result>('/api/permission', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updatePermission(params: Permission.PermissionInfo) {
  return request<Common.Result>(`/api/permission/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function deletePermission(params: Permission.PermissionInfo) {
  return request<Common.Result>(`/api/permission/${params.id}`, {
    method: 'DELETE',
  });
}

export async function getPermissionInfo(permissionId: number) {
  return request<Permission.PermissionInfoApi>(
    `/api/permission/${permissionId}`,
    {
      method: 'GET',
    },
  );
}

export async function changePermissionRoutes(
  params: Permission.PermissionRoute,
) {
  return request<Common.Result>(`/api/permission/${params.id}/routes`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
