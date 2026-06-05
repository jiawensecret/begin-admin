declare namespace Common {
  interface Result<T = any> {
    data?: T;
    msg: string;
  }
  interface MeApi {
    data: Me;
    msg: string;
  }

  interface Me {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    tel?: string;
    user_status?: number;
    permissions?: Array<Permissions>;
    permission?: Array<any>;
    menu?: Array<Menu>;
  }

  interface MenuApi {
    data: Array<Menu>;
    msg: string;
  }

  interface Menu {
    id?: number;
    name?: string;
    path?: string;
    component?: string;
    routes?: Array<Menu>;
  }

  interface Permissions {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
  }
}
