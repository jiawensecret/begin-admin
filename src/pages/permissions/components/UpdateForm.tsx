import { Button, Form, Input, Modal, TreeSelect } from 'antd';
import React, { useState } from 'react';

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formValues?: Permission.PermissionInfo) => void;
  onSubmit: (values: Permission.PermissionInfo) => Promise<void>;
  updateModalVisible: boolean;
  values: Permission.PermissionInfo;
  menus: Array<Menu.MenuInfo>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formValues, setFormValues] = useState<Permission.PermissionInfo>({
    id: props.values.id,
    name: props.values.name,
    code: props.values.code,
    description: props.values.description,
    menu_id: props.values.menu_id,
  });
  const [form] = Form.useForm();
  const { updateModalVisible, onCancel } = props;
  const { onSubmit: handleUpdate, onCancel: handleUpdateModalVisible } = props;
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    setFormValues({ ...formValues, ...fieldsValue });
    await handleUpdate({ ...formValues, ...fieldsValue });
  };
  const [menus] = useState<Array<Menu.MenuInfo>>(props.menus);

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
      title="编辑权限"
      open={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >
      <Form
        form={form}
        initialValues={{
          id: formValues.id,
          name: formValues.name,
          code: formValues.code,
          description: formValues.description,
          menu_id: formValues.menu_id,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
