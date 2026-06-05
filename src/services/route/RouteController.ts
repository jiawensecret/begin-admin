import { request } from '@umijs/max';

export async function queryRouteList(params: {
  name?: string;
  method?: string;
  path?: string;
  page?: number;
  page_size?: number;
}) {
  return request<Route.RouteListApi>('/api/routes', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getRoutes() {
  return request<Route.RouteListApi>('/api/all-routes', {
    method: 'GET',
  });
}

export async function addRoute(params: Route.RouteInfo) {
  return request<Common.Result>('/api/route', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRoute(params: Route.RouteInfo) {
  return request<Common.Result>(`/api/route/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
