import { getUserPermission } from '@/services/user/UserController';
import { Button, Drawer } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Checkbox from 'antd/es/checkbox/Checkbox';
import React, { useEffect, useState } from 'react';
import './user-permission.less';

export interface UserPermissionFormProps {
  onCancel: (flag?: boolean, formValues?: User.UserInfo) => void;
  onSubmit: (values: User.UserPermissionForm) => Promise<void>;
  values: User.UserInfo;
  drawerVisit: boolean;
}

interface PermissionProps {
  data: User.UserPermission;
}

const UserPermission: React.FC<UserPermissionFormProps> = (props) => {
  const { drawerVisit, onCancel } = props;
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const { onSubmit: handleUpdate, onCancel: handleDrawerVisit } = props;
  const handleNext = async () => {
    await handleUpdate({
      permission_ids: checkedList,
      id: props.values.id ?? 0,
    });
  };

  const [permissions, setPermissions] = useState<Array<User.UserPermission>>(
    [],
  );

  const getInitCheckPermissions = (permission: User.UserPermission) => {
    let checkPermissions: number[] = [];
    if (permission.permissions && permission.permissions.length > 0) {
      for (const p of permission.permissions) {
        if (p.checked) checkPermissions.push(p.id ?? 0);
      }
    }
    if (permission.children && permission.children.length > 0) {
      for (const child of permission.children) {
        checkPermissions = checkPermissions.concat(
          getInitCheckPermissions(child),
        );
      }
    }
    return checkPermissions;
  };

  const fetchUserPermission = async () => {
    if (props.values.id) {
      const { data } = await getUserPermission(props.values.id);
      if (data) {
        setPermissions(data);
        let checkPermissions: number[] = [];
        for (const permission of data) {
          checkPermissions = checkPermissions.concat(
            getInitCheckPermissions(permission),
          );
        }
        setCheckedList(checkPermissions);
      }
    }
  };

  const union = (arr1: number[], arr2: number[]) => {
    const combinedArray = [...arr1, ...arr2];
    // 使用 Set 数据结构来去除重复元素
    return Array.from(new Set(combinedArray));
  };

  const difference = (arr1: number[], arr2: number[]) => {
    const set2 = new Set(arr2);
    return arr1.filter((element) => !set2.has(element));
  };

  const getAllPermissions = (permission: User.UserPermission) => {
    let permissions: number[] = [];

    if (permission.permissions && permission.permissions.length > 0) {
      for (const p of permission.permissions) {
        permissions.push(p.id ?? 0);
      }
    }

    if (permission.children && permission.children.length > 0) {
      for (const child of permission.children) {
        permissions = permissions.concat(getAllPermissions(child));
      }
    }

    return permissions;
  };

  //获取select状态
  const indeterminate = (permission: User.UserPermission) => {
    const childrenPermissionIds = getAllPermissions(permission);
    let flag: boolean = false;
    let count: number = 0;
    for (const i of childrenPermissionIds) {
      if (!checkedList?.includes(i)) {
        flag = true;
      } else {
        count++;
      }
    }
    return count > 0 && flag;
  };

  const findNodeById = (
    id: number,
    permissions: User.UserPermission[],
  ): User.UserPermission | null => {
    for (const permission of permissions) {
      if (permission.id === id) return permission;

      if (permission.children) {
        const foundNode = findNodeById(id, permission.children);
        if (foundNode) return foundNode;
      }
    }

    return null;
  };

  const onCheckAllChange = (
    permissionId: number | undefined,
    e: CheckboxChangeEvent,
  ) => {
    const permissionNode = findNodeById(permissionId ?? 0, permissions);
    if (!permissionNode) return;
    const childrenPermissionIds = getAllPermissions(permissionNode);
    if (e.target.checked) {
      setCheckedList(union(checkedList, childrenPermissionIds));
    } else {
      setCheckedList(difference(checkedList, childrenPermissionIds));
    }
  };

  const onCheckChange = (
    permissionId: number | undefined,
    e: CheckboxChangeEvent,
  ) => {
    let checked: number[] = [];
    checked.push(permissionId ?? 0);
    if (e.target.checked) {
      setCheckedList(union(checkedList, checked));
    } else {
      setCheckedList(difference(checkedList, checked));
    }
  };

  const checkIn = (permission: User.UserPermission) => {
    const childrenPermissionIds = getAllPermissions(permission);
    for (const i of childrenPermissionIds) {
      if (!checkedList?.includes(i)) return false;
    }
    return true;
  };

  const isChecked = (id: number) => {
    return !!checkedList?.includes(id);
  };

  const PermissionComponent: React.FC<PermissionProps> = ({ data }) => {
    if (data.children) {
      return (
        <>
          {data.children.map((item) => (
            <div className="room-column flex-row my-2" key={'m' + item.id}>
              <Checkbox
                className="checkbox f-check"
                indeterminate={indeterminate(item)}
                onChange={(e) => onCheckAllChange(item.id, e)}
                checked={checkIn(item)}
              >
                {item.name}
              </Checkbox>
              <PermissionComponent
                key={'k' + item.id}
                data={item}
              ></PermissionComponent>
            </div>
          ))}
        </>
      );
    } else {
      if (data.permissions)
        return (
          <>
            <div className="room-column my-2">
              {data.permissions.map((permission) => (
                <Checkbox
                  className="checkbox"
                  onChange={(e) => onCheckChange(permission.id, e)}
                  checked={isChecked(permission.id ?? 0)}
                  key={'p' + permission.id}
                >
                  {permission.name}
                </Checkbox>
              ))}
            </div>
          </>
        );

      return <></>;
    }
  };

  const ChildComponent: React.FC<PermissionProps> = ({ data }) => {
    return (
      <>
        {data.children?.map((item) => (
          <div className="room flex-1 items-center" key={'m' + item.id}>
            <Checkbox
              className="checkbox f-check"
              indeterminate={indeterminate(item)}
              onChange={(e) => onCheckAllChange(item.id, e)}
              checked={checkIn(item)}
            >
              {item.name}
            </Checkbox>
            <div className="flex-col">
              <PermissionComponent
                key={'k' + item.id}
                data={item}
              ></PermissionComponent>
            </div>
          </div>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (props.values.id) fetchUserPermission().then();
  }, []);

  const renderFooter = () => {
    return (
      <>
        <div style={{ textAlign: 'left' }}>
          <Button
            style={{ marginLeft: '8px' }}
            onClick={() => handleDrawerVisit(false)}
          >
            取消
          </Button>
          <Button
            style={{ marginLeft: '8px' }}
            type="primary"
            onClick={() => handleNext()}
          >
            提交
          </Button>
        </div>
      </>
    );
  };
  // @ts-ignore
  return (
    <Drawer
      title="用户权限配置"
      open={drawerVisit}
      width={'80%'}
      footer={renderFooter()}
      onClose={() => onCancel()}
    >
      <div>
        {permissions.map((item, index) => (
          <div key={index}>
            <div className="room ">
              <div className="room-left">
                <div className="flex-col justify-center">
                  <Checkbox
                    className="checkbox f-check"
                    onChange={(e) => onCheckAllChange(item.id, e)}
                    indeterminate={indeterminate(item)}
                    checked={checkIn(item)}
                    key={'m' + item.id}
                  >
                    {item.name}
                  </Checkbox>
                </div>
              </div>
              <div className="room-right">
                <ChildComponent key={'a' + item.id} data={item} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};
export default UserPermission;
