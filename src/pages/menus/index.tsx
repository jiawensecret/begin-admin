import CreateForm from '@/pages/menus/components/CreateForm';
import UpdateForm from '@/pages/menus/components/UpdateForm';
import {
  addMenu,
  deleteMenu,
  queryMenuList,
  updateMenu,
} from '@/services/menu/MenuController';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, Divider, message, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useState } from 'react';

const handleAdd = async (fields: Menu.MenuInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addMenu({ ...fields });
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
const handleUpdate = async (fields: Menu.MenuInfo) => {
  const hide = message.loading('正在更新');
  try {
    await updateMenu({ ...fields });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const handleRemove = async (fields: Menu.MenuInfo) => {
  const hide = message.loading('正在删除');
  try {
    await deleteMenu({ ...fields });
    hide();
    message.success('成功');
    return true;
  } catch (error) {
    hide();
    if (error) {
      // @ts-ignore
      message.error(error.response?.data.msg ?? '');
    }
    return false;
  }
};

export default () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const access = useAccess();
  const [menus, setMenus] = useState<Array<Menu.MenuInfo>>([]);
  const fetchMenus = async () => {
    const { data } = await queryMenuList();
    setMenus(data);
  };

  useEffect(() => {
    fetchMenus().then();
  }, []);

  const columns: ColumnsType<Menu.MenuInfo> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '路径',
      dataIndex: 'route',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'menu_status',
      render: (text) => (
        <>
          <Tag color={text === 1 ? 'green-inverse' : 'volcano-inverse'}>
            {text === 1 ? '开启' : '禁用'}
          </Tag>
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      render: (_, record) => (
        <>
          <Access accessible={access.MenuUpdate}>
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
          <Access accessible={access.MenuDelete}>
            <a
              onClick={async () => {
                const success = await handleRemove(record);
                if (success) {
                  fetchMenus().then();
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
  return (
    <PageContainer
      header={{
        title: '菜单管理',
        extra: [
          <Access accessible={access.MenuAdd} key={'add'}>
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
        ],
      }}
    >
      <Table<Menu.MenuInfo>
        columns={columns}
        dataSource={menus}
        rowKey="id"
        pagination={false}
        expandable={{
          defaultExpandAllRows: true,
        }}
      />
      {menus && menus.length ? (
        <CreateForm
          onCancel={() => handleModalVisible(false)}
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              fetchMenus().then();
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
              fetchMenus().then();
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
    </PageContainer>
  );
};
