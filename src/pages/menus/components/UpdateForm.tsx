import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  TreeSelect,
} from 'antd';
import React, { useState } from 'react';

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formValues?: Menu.MenuInfo) => void;
  onSubmit: (values: Menu.MenuInfo) => Promise<void>;
  updateModalVisible: boolean;
  values: Menu.MenuInfo;
  menus: Array<Menu.MenuInfo>;
}

function filterMenuTreeData(
  data: Array<Menu.MenuInfo> | undefined,
  value: any,
): Array<Menu.MenuInfo> {
  if (data) {
    return data
      .filter((node) => node.id !== value)
      .map((node) => {
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: filterMenuTreeData(node.children, value),
          };
        }
        return node;
      });
  }

  return [];
}

function addOriginFatherMenu(data: Array<Menu.MenuInfo>): Array<Menu.MenuInfo> {
  const flag = !!data.find((obj) => obj.id === 0);
  if (!flag) {
    data.unshift({
      name: '/',
      id: 0,
    });
  }
  return data;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formValues, setFormValues] = useState<Menu.MenuInfo>({
    id: props.values.id,
    name: props.values.name,
    menu_status: props.values.menu_status,
    component: props.values.component,
    is_hide: props.values.is_hide,
    menu_sort: props.values.menu_sort,
    route: props.values.route,
    parent_id: props.values.parent_id,
  });
  const [menus] = useState<Array<Menu.MenuInfo>>(props.menus);
  const [form] = Form.useForm();
  const { updateModalVisible, onCancel } = props;
  const { onSubmit: handleUpdate, onCancel: handleUpdateModalVisible } = props;
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormValues({ ...formValues, ...fieldsValue });
    await handleUpdate({ ...formValues, ...fieldsValue });
  };

  const updateMenus = filterMenuTreeData(menus, formValues.id);
  const useMenus = addOriginFatherMenu(updateMenus);

  const renderContent = () => {
    return (
      <>
        <Form.Item name="parent_id" label="父级菜单">
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={useMenus}
            placeholder="请选择父级菜单"
            treeDefaultExpandAll
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item
          name="route"
          label="路由"
          rules={[{ required: true, message: '请输入路由！' }]}
        >
          <Input placeholder="请输入路由" allowClear />
        </Form.Item>
        <Form.Item name="component" label="组件地址">
          <Input placeholder="请输入组件地址" allowClear />
        </Form.Item>
        <Form.Item
          name="is_hide"
          label="是否隐藏"
          initialValue={0}
          rules={[{ required: true, message: '请选择！' }]}
        >
          <Radio.Group>
            <Radio value={1}>隐藏</Radio>
            <Radio value={0}>展示</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="menu_status"
          label="状态"
          rules={[{ required: true, message: '请选择状态！' }]}
        >
          <Radio.Group>
            <Radio value={1}>正常</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="menu_sort" label="排序">
          <InputNumber
            min={1}
            placeholder="请输入排序"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </>
    );
  };
  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, formValues)}>
          取消
        </Button>
        <Button type="primary" onClick={() => handleNext()}>
          提交
        </Button>
      </>
    );
  };
  return (
    <Modal
      width={640}
      styles={{ body: { padding: '32px 40px 48px' } }}
      destroyOnClose
      title="编辑菜单"
      open={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >
      <Form
        form={form}
        initialValues={{
          id: formValues.id,
          name: formValues.name,
          menu_status: formValues.menu_status,
          menu_sort: formValues.menu_sort,
          component: formValues.component,
          is_hide: formValues.is_hide,
          route: formValues.route,
          parent_id: formValues.parent_id,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
