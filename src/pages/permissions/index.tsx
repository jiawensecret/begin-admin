import CreateForm from '@/pages/permissions/components/CreateForm';
import RouteForm from '@/pages/permissions/components/Route';
import UpdateForm from '@/pages/permissions/components/UpdateForm';
import { queryMenuList } from '@/services/menu/MenuController';
import {
  addPermission,
  changePermissionRoutes,
  deletePermission,
  getPermissions,
  updatePermission,
} from '@/services/permission/PermissionController';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, Divider, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

const handleAdd = async (fields: Permission.PermissionInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addPermission({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: Permission.PermissionInfo) => {
  const hide = message.loading('正在更新');
  try {
    await updatePermission({ ...fields });
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

const handlePermissionRoute = async (fields: Permission.PermissionRoute) => {
  const hide = message.loading('正在修改');
  try {
    await changePermissionRoutes({ ...fields });
    hide();

    message.success('成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const handleRemove = async (fields: Permission.PermissionInfo) => {
  const hide = message.loading('正在删除');
  try {
    await deletePermission({ ...fields });
    hide();
    message.success('成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

export default () => {
  const actionRef = useRef<ActionType>();
  const urlObj = new URL(window.location.href);
  const menuId = Number(urlObj.searchParams.get('menu_id')) ?? 0;

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [routeFormValues, setRouteFormValues] = useState({});
  const [routeModalVisible, handleRouteModalVisible] = useState<boolean>(false);
  const access = useAccess();
  const [menus, setMenus] = useState<Array<Menu.MenuInfo>>([]);
  const fetchMenus = async () => {
    const { data } = await queryMenuList();
    setMenus(data);
  };

  useEffect(() => {
    fetchMenus().then();
  }, []);
  const columns: ProColumns<Permission.PermissionInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      sorter: true,
      ellipsis: true,
      search: false,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'code码',
      dataIndex: 'code',
      ellipsis: true,
    },
    {
      title: '详情描述信息',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'date',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
        <>
          <Access accessible={access.PermissionUpdate}>
            <a
              onClick={() => {
                setUpdateFormValues(record);
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
          </Access>
          <Divider type="vertical" />
          <Access accessible={access.PermissionAddRoute}>
            <a
              onClick={() => {
                setRouteFormValues(record);
                handleRouteModalVisible(true);
              }}
            >
              路由配置
            </a>
          </Access>
          <Divider type="vertical" />
          <Access accessible={access.PermissionDelete}>
            <a
              onClick={async () => {
                const success = await handleRemove(record);
                if (success && actionRef.current) {
                  await actionRef.current.reload();
                }
              }}
            >
              删除
            </a>
          </Access>
        </>
      ),
    },
  ];
  // @ts-ignore
  return (
    <PageContainer
      header={{
        title: '权限管理',
      }}
    >
      <ProTable<Permission.PermissionInfo>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          const { data } = await getPermissions(menuId, {
            ...params,
            // @ts-ignore
            filter,
          });
          const success = !!data;
          return {
            data: data || [],
            success,
          };
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          collapsed: false,
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        dateFormatter="string"
        headerTitle="权限列表"
        toolBarRender={() => [
          // eslint-disable-next-line react/jsx-key
          <Access accessible={access.PermissionAdd}>
            <Button
              key="button"
              onClick={() => {
                handleModalVisible(true);
              }}
              type="primary"
            >
              新建
            </Button>
          </Access>,
        ]}
      />
      {menus && Object.keys(menus).length ? (
        <CreateForm
          onCancel={() => handleModalVisible(false)}
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                await actionRef.current.reload();
              }
            }
          }}
          createModalVisible={createModalVisible}
          menus={menus}
        ></CreateForm>
      ) : null}
      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setUpdateFormValues({});
              if (actionRef.current) {
                await actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={updateFormValues}
          menus={menus}
        />
      ) : null}
      {routeFormValues && Object.keys(routeFormValues).length ? (
        <RouteForm
          onSubmit={async (value) => {
            const success = await handlePermissionRoute(value);
            if (success) {
              handleRouteModalVisible(false);
              setRouteFormValues({});
              if (actionRef.current) {
                await actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleRouteModalVisible(false);
            setRouteFormValues({});
          }}
          drawerVisit={routeModalVisible}
          values={routeFormValues}
        />
      ) : null}
      )
    </PageContainer>
  );
};
