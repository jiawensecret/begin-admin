import { Button, Form, Input, Modal, Radio } from 'antd';
import React, { useState } from 'react';

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formValues?: User.UserInfo) => void;
  onSubmit: (values: User.UserInfo) => Promise<void>;
  updateModalVisible: boolean;
  values: User.UserInfo;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formValues, setFormValues] = useState<User.UserInfo>({
    id: props.values.id,
    name: props.values.name,
    tel: props.values.tel,
    username: props.values.username,
    user_status: props.values.user_status,
  });
  const [form] = Form.useForm();
  const { updateModalVisible, onCancel } = props;
  const { onSubmit: handleUpdate, onCancel: handleUpdateModalVisible } = props;
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    setFormValues({ ...formValues, ...fieldsValue });
    await handleUpdate({ ...formValues, ...fieldsValue });
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
      title="修改用户"
      open={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >
      <Form
        form={form}
        initialValues={{
          id: formValues.id,
          name: formValues.name,
          username: formValues.username,
          tel: formValues.tel,
          user_status: formValues.user_status,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
