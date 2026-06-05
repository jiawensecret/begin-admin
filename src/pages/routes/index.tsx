import CreateForm from '@/pages/routes/components/CreateForm';
import UpdateForm from '@/pages/routes/components/UpdateForm';
import services from '@/services/route';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';

const { queryRouteList, updateRoute, addRoute } = services.RouteController;

const handleAdd = async (fields: User.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addRoute({ ...fields });
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
    await updateRoute({ ...fields });
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
  const access = useAccess();
  const columns: ProColumns<Route.RouteInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      sorter: true,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        get: {
          text: 'GET',
        },
        post: {
          text: 'POST',
        },
        put: {
          text: 'PUT',
        },
        delete: {
          text: 'DELETE',
        },
        patch: {
          text: 'PATCH',
        },
      },
    },
    {
      title: '路径',
      dataIndex: 'path',
      ellipsis: true,
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
          <Access accessible={access.RouteUpdate}>
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
        </>
      ),
    },
  ];
  // @ts-ignore
  return (
    <PageContainer
      header={{
        title: '路由管理',
      }}
    >
      <ProTable<User.UserInfo>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          const { data } = await queryRouteList({
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
        headerTitle="路由列表"
        toolBarRender={() => [
          // eslint-disable-next-line react/jsx-key
          <Access accessible={access.RouteAdd}>
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
    </PageContainer>
  );
};
