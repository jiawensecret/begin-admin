/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace Route {
  interface RouteListApi {
    data: RouteList;
    msg: string;
  }

  interface RouteList {
    page?: number;
    pageSize?: number;
    total?: number;
    list?: Array<RouteInfo>;
  }

  interface RouteInfo {
    id?: number;
    name?: string;
    method?: string;
    path?: string;
    created_at?: string;
  }
}
