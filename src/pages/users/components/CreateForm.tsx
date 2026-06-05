import { Button, Form, Input, Modal, Radio } from 'antd';
import React, { useState } from 'react';

interface CreateFormProps {
  onCancel: (flag?: boolean, formValues?: User.UserInfo) => void;
  onSubmit: (values: User.UserInfo) => void;
  createModalVisible: boolean;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { createModalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const [formValues] = useState<User.UserInfo>({});

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
          label="昵称"
          rules={[{ required: true, message: '请输入用户昵称！' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名！' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="tel"
          label="手机号"
          rules={[{ required: true, message: '请输入手机号！' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="user_status"
          label="状态"
          initialValue={1}
          rules={[{ required: true, message: '请选择用户状态！' }]}
        >
          <Radio.Group>
            <Radio value={0}>禁用</Radio>
            <Radio value={1}>正常</Radio>
          </Radio.Group>
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
