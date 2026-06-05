import { request } from '@umijs/max';

export async function queryUserList(params: {
  username?: string;
  name?: string;
  tel?: string;
  permission_str?: string;
  page?: number;
  page_size?: number;
}) {
  return request<User.UserListApi>('/api/users', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function addUser(params: User.UserInfo) {
  return request<Common.Result>('/api/user', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateUser(params: User.UserInfo) {
  return request<Common.Result>(`/api/user/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function getUserPermission(userId: number) {
  return request<User.UserPermissionApi>(`/api/user/${userId}/permissions`, {
    method: 'GET',
  });
}

export async function updateUserPermission(params: User.UserPermissionForm) {
  return request<Common.Result>(`/api/user/${params.id}/permission`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
