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

interface CreateFormProps {
  onCancel: (flag?: boolean, formValues?: User.UserInfo) => void;
  onSubmit: (values: User.UserInfo) => void;
  createModalVisible: boolean;
  menus: Array<Menu.MenuInfo>;
}

function addOriginFatherMenu(data: Array<Menu.MenuInfo>) {
  const flag = !!data.find((obj) => obj.id === 0);
  if (!flag) {
    data.unshift({
      name: '/',
      id: 0,
    });
  }
  return data;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { createModalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const [formValues] = useState<User.UserInfo>({});

  const { onSubmit: handleCreate, onCancel: handleCreateModalVisible } = props;
  const [menus] = useState<Array<Menu.MenuInfo>>(props.menus);
  const useMenus = addOriginFatherMenu(menus);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    form.resetFields();
    handleCreate({ ...formValues, ...fieldsValue });
  };

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
          initialValue={1}
          rules={[{ required: true, message: '请选择状态！' }]}
        >
          <Radio.Group>
            <Radio value={1}>正常</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="menu_sort" label="排序" initialValue={1}>
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
        <Button onClick={() => handleCreateModalVisible(false, formValues)}>
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
      destroyOnClose={true}
      title="新建菜单"
      open={createModalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >
      <Form form={form} initialValues={{}}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateForm;
