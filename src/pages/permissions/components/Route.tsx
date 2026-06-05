import { Button, Drawer, Form, Transfer } from 'antd';
import React, { Key, useEffect, useState } from 'react';

import { getPermissionInfo } from '@/services/permission/PermissionController';
import { getRoutes } from '@/services/route/RouteController';

export interface RouteFormProps {
  onCancel: (flag?: boolean, formValues?: Permission.PermissionInfo) => void;
  onSubmit: (values: Permission.PermissionRoute) => Promise<void>;
  values: Permission.PermissionInfo;
  drawerVisit: boolean;
}

interface AllRouteType {
  key: string;
  title: string;
  description: string;
}

const RouteForm: React.FC<RouteFormProps> = (props) => {
  const [formValues, setFormValues] = useState<Route.RouteInfo>({
    id: props.values.id,
  });
  const [allRoutes, setAllRoutes] = useState<Array<AllRouteType>>([]);
  const [keys, setKeys] = useState<Array<string>>([]);
  const { drawerVisit, onCancel } = props;
  const [form] = Form.useForm();
  const { onSubmit: handleUpdate, onCancel: handleDrawerVisit } = props;
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    console.log(fieldsValue);
    setFormValues({ ...formValues, ...fieldsValue });
    await handleUpdate({ ...formValues, ...fieldsValue });
  };

  const fetchRoutes = async () => {
    const { data } = await getRoutes();
    if (data.list) {
      const tempData: React.SetStateAction<AllRouteType[]> = [];
      data.list.forEach((item) => {
        let a = {
          key: String(item.id),
          title: String(item.name ?? '') + '(' + String(item.path ?? '') + ')',
          description: String(item.method),
        };
        tempData.push(a);
      });
      setAllRoutes(tempData);
    }
  };

  const fetchPermission = async () => {
    const { data } = await getPermissionInfo(formValues.id ?? 0);
    if (data.routes) {
      const ids = data.routes.map((node) => node.id?.toString() ?? '');
      if (ids) setKeys(ids);
    }
  };

  const handleChange = (newTargetKeys: Key[]) => {
    const routeKeys = newTargetKeys.map(String);
    setKeys(routeKeys);
    const ids: number[] = routeKeys.map((value) => {
      return parseInt(value);
    });
    form.setFieldsValue({ route_ids: ids });
  };

  const renderItem = (item: AllRouteType) => {
    const customLabel = (
      <span className="custom-item">
        {item.title}[{item.description}]
      </span>
    );

    return {
      label: customLabel,
      value: item.title,
    };
  };

  useEffect(() => {
    if (formValues.id) fetchRoutes().then();
  }, []);

  useEffect(() => {
    if (formValues.id) fetchPermission().then();
  }, []);

  const renderFooter = () => {
    return (
      <>
        <div style={{ textAlign: 'right' }}>
          <Button
            style={{ marginLeft: '8px' }}
            onClick={() => handleDrawerVisit(false, formValues)}
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
      title="路由配置"
      open={drawerVisit}
      width={'70%'}
      footer={renderFooter()}
      onClose={() => onCancel()}
    >
      <Form form={form} initialValues={{}}>
        <Form.Item name="route_ids">
          <Transfer
            dataSource={allRoutes}
            showSearch
            listStyle={{
              width: '80%',
              height: '80%',
            }}
            targetKeys={keys}
            onChange={handleChange}
            render={renderItem}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
export default RouteForm;
