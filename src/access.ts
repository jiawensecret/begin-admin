export default (initialState: Common.Me) => {
  const isAdmin = initialState && initialState.id === 1;
  const UserList =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:list')
    ) || isAdmin;
  const UserAdd =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:add')
    ) || isAdmin;
  const UserUpdate =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:update')
    ) || isAdmin;
  const UserChangeStatus =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:change-status')
    ) || isAdmin;
  const UserPermission =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:permissions')
    ) || isAdmin;
  const UserMenu =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:menu')
    ) || isAdmin;
  const UserCreatePermission =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:create-permissions')
    ) || isAdmin;
  const UserModifyPermission =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:modify-permissions')
    ) || isAdmin;
  const UserDataPermission =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:data-permissions')
    ) || isAdmin;
  const UserCopyUser =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:copy-user')
    ) || isAdmin;
  const UserInfo =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('user:info')
    ) || isAdmin;

  const MenuList =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('menu:list')
    ) || isAdmin;
  const MenuAdd =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('menu:add')
    ) || isAdmin;
  const MenuUpdate =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('menu:update')
    ) || isAdmin;
  const MenuDelete =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('menu:delete')
    ) || isAdmin;

  const PermissionList =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('permission:list')
    ) || isAdmin;
  const PermissionTree =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('permission:tree')
    ) || isAdmin;
  const PermissionAdd =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('permission:add')
    ) || isAdmin;
  const PermissionUpdate =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('permission:update')
    ) || isAdmin;
  const PermissionDelete =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('permission:delete')
    ) || isAdmin;
  const PermissionAddRoute =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('permission:add-route')
    ) || isAdmin;
  const RouteList =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('route:list')
    ) || isAdmin;
  const RouteAdd =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('route:add')
    ) || isAdmin;
  const RouteUpdate =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('route:update')
    ) || isAdmin;
  const RouteDelete =
    !!(
      initialState &&
      initialState.permission &&
      initialState.permission.includes('route:delete')
    ) || isAdmin;

  const MockList = !!(
    initialState &&
    initialState.permission &&
    initialState.permission.includes('mock-api:list')
  );

  const MockAdd = !!(
    initialState &&
    initialState.permission &&
    initialState.permission.includes('mock-api:add')
  );

  const MockUpdate = !!(
    initialState &&
    initialState.permission &&
    initialState.permission.includes('mock-api:update')
  );

  return {
    UserList,
    UserAdd,
    UserUpdate,
    UserChangeStatus,
    UserPermission,
    UserMenu,
    UserCreatePermission,
    UserModifyPermission,
    UserDataPermission,
    UserCopyUser,
    UserInfo,
    MenuList,
    MenuAdd,
    MenuUpdate,
    MenuDelete,
    PermissionList,
    PermissionTree,
    PermissionAdd,
    PermissionUpdate,
    PermissionDelete,
    RouteList,
    RouteAdd,
    RouteUpdate,
    RouteDelete,
    //权限绑定路由
    PermissionAddRoute,
    //mock地址
    MockList,
    MockAdd,
    MockUpdate,
    //文章发布
  };
};
