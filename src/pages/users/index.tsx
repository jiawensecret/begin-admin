import CreateForm from '@/pages/users/components/CreateForm';
import UpdateForm from '@/pages/users/components/UpdateForm';
import UserPermission from '@/pages/users/components/UserPermission';
import services from '@/services/user';
import {
  addUser,
  updateUser,
  updateUserPermission,
} from '@/services/user/UserController';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, Divider, message } from 'antd';
import { useRef, useState } from 'react';

const { queryUserList } = services.UserController;

const handleAdd = async (fields: User.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
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
const handleUpdate = async (fields: User.UserInfo) => {
  const hide = message.loading('正在更新');
  try {
    await updateUser({ ...fields });
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

const handlePermissionUpdate = async (fields: User.UserPermissionForm) => {
  const hide = message.loading('正在更新');
  try {
    await updateUserPermission({ ...fields });
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

export default () => {
  const actionRef = useRef<ActionType>();

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [permissionFormValues, setPermissionFormValues] = useState({});
  const [permissionModalVisible, handlePermissionModalVisible] =
    useState<boolean>(false);
  const access = useAccess();
  const columns: ProColumns<User.UserInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      sorter: true,
      ellipsis: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '电话',
      dataIndex: 'tel',
      ellipsis: true,
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'user_status',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '禁用',
          status: 'Error',
        },
        1: {
          text: '正常',
          status: 'Success',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            start_time: value[0],
            end_time: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
        <>
          <Access accessible={access.UserUpdate}>
            <a
              onClick={() => {
                setUpdateFormValues(record);
                handleUpdateModalVisible(true);
                console.log(record);
              }}
            >
              编辑
            </a>
          </Access>
          <Divider type="vertical" />
          {/*<Access accessible={access.UserPermission}>*/}
          <a
            onClick={() => {
              setPermissionFormValues(record);
              handlePermissionModalVisible(true);
              console.log(record);
            }}
          >
            权限
          </a>
          {/*</Access>*/}
        </>
      ),
    },
  ];
  // @ts-ignore
  return (
    <PageContainer
      header={{
        title: '用户管理',
      }}
    >
      <ProTable<User.UserInfo>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          const { data } = await queryUserList({
            ...params,
            // @ts-ignore
            filter,
          });
          const success = !!data;
          return {
            data: data?.list || [],
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
        headerTitle="用户列表"
        toolBarRender={() => [
          // eslint-disable-next-line react/jsx-key
          <Access accessible={access.UserAdd}>
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
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        createModalVisible={createModalVisible}
      ></CreateForm>
      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setUpdateFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={updateFormValues}
        />
      ) : null}
      {permissionFormValues && Object.keys(permissionFormValues).length ? (
        <UserPermission
          onSubmit={async (value) => {
            const success = await handlePermissionUpdate(value);
            if (success) {
              handlePermissionModalVisible(false);
              setPermissionFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handlePermissionModalVisible(false);
            setPermissionFormValues({});
          }}
          drawerVisit={permissionModalVisible}
          values={permissionFormValues}
        />
      ) : null}
    </PageContainer>
  );
};
