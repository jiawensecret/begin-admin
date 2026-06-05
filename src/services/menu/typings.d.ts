/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace Menu {
  interface MenuListApi {
    data: Array<MenuInfo>;
    msg: string;
  }

  interface MenuInfo {
    id?: number;
    name?: string;
    code?: string;
    menu_sort?: number;
    menu_status?: number;
    route?: string;
    description?: string;
    component?: string;
    is_hide?: boolean;
    parent_id?: number;
    flag?: string;
    created_at?: string;
    children?: Array<MenuInfo>;
  }
}
