import { Button, Form, Input, Modal, TreeSelect } from 'antd';
import React, { useState } from 'react';

interface CreateFormProps {
  onCancel: (flag?: boolean, formValues?: Permission.PermissionInfo) => void;
  onSubmit: (values: Permission.PermissionInfo) => void;
  createModalVisible: boolean;
  menus: Array<Menu.MenuInfo>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { createModalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const [formValues] = useState<Permission.PermissionInfo>({});
  const [menus] = useState<Array<Menu.MenuInfo>>(props.menus);
  const { onSubmit: handleCreate, onCancel: handleCreateModalVisible } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    form.resetFields();
    handleCreate({ ...formValues, ...fieldsValue });
  };

  const renderContent = () => {
    return (
      <>
        <Form.Item name="menu_id" label="菜单">
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={menus}
            placeholder="请选择菜单"
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
          <Input placeholder="请输入名称" allowClear />
        </Form.Item>
        <Form.Item
          name="code"
          label="编码"
          rules={[{ required: true, message: '请输入编码！' }]}
        >
          <Input placeholder="请输入编码" allowClear />
        </Form.Item>
        <Form.Item name="description" label="详情描述">
          <Input placeholder="请输入详情描述" />
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
      title="新增权限"
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
