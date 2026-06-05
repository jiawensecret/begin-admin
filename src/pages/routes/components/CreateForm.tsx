import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';

interface CreateFormProps {
  onCancel: (flag?: boolean, formValues?: Menu.MenuInfo) => void;
  onSubmit: (values: Menu.MenuInfo) => void;
  createModalVisible: boolean;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { createModalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const [formValues] = useState<Menu.MenuInfo>({});

  const { onSubmit: handleCreate, onCancel: handleCreateModalVisible } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    form.resetFields();
    handleCreate({ ...formValues, ...fieldsValue });
  };

  const renderContent = () => {
    return (
      <>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="method"
          label="请求方式"
          rules={[{ required: true, message: '请选择请求方式！' }]}
        >
          <Select
            options={[
              { value: 'get', label: 'GET' },
              { value: 'post', label: 'POST' },
              { value: 'put', label: 'PUT' },
              { value: 'delete', label: 'DELETE' },
              { value: 'patch', label: 'PATCH' },
            ]}
            placeholder="请选择"
          />
        </Form.Item>
        <Form.Item
          name="path"
          label="路径"
          rules={[{ required: true, message: '请输入路径！' }]}
        >
          <Input placeholder="请输入路径" allowClear />
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
      title="创建人员"
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
