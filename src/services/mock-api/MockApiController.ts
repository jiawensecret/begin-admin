import { request } from '@umijs/max';

export async function queryMockList(params: {
  name?: string;
  code?: string;
  page?: number;
  page_size?: number;
}) {
  return request<MockApi.MockListApi>('/api/mock-api', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function addMockApi(params: MockApi.MockInfo) {
  return request<Common.Result>('/api/mock-api', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMockApi(params: MockApi.MockInfo) {
  return request<Common.Result>(`/api/mock-api/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
