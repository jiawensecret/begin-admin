/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace Permission {
  interface MenuPermissionApi {
    data: Array<PermissionInfo>;
    msg: string;
  }

  interface PermissionInfoApi {
    data: PermissionInfo;
    msg: string;
  }

  interface PermissionInfo {
    id?: number;
    name?: string;
    code?: string;
    menu_id?: number;
    description?: string;
    routes?: Array<Route.RouteInfo> | null;
    created_at?: string;
  }

  interface PermissionRoute {
    id: number;
    route_ids: string[];
  }
}
