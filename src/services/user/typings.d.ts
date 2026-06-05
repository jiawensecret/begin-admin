declare namespace User {
  interface UserListApi {
    data: UserList;
    msg: string;
  }

  interface UserList {
    page?: number;
    pageSize?: number;
    total?: number;
    list?: Array<UserInfo>;
  }

  interface UserInfo {
    id?: number;
    username?: string;
    name?: string;
    tel?: string;
    email?: string;
    user_status?: number;
    permissions?: any;
    created_at?: string;
  }

  interface UserPermissionForm {
    id: number;
    permission_ids: number[];
  }

  interface UserPermissionApi {
    data: Array<UserPermission>;
    msg: string;
  }
  interface UserPermission {
    id?: number;
    name?: string;
    code?: string;
    menu_sort?: number;
    menu_status?: number;
    route?: string;
    description?: string;
    component?: string;
    parent_id?: number;
    flag?: string;
    permissions?: Array<Permission>;
    created_at?: string;
    children?: Array<UserPermission>;
  }

  interface Permission {
    id?: number;
    checked?: boolean;
    code?: string;
    created_at?: string;
    description?: string;
    flag?: string;
    menu_id?: number;
    name?: string;
  }
}
