import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formValues?: Route.RouteInfo) => void;
  onSubmit: (values: Route.RouteInfo) => Promise<void>;
  updateModalVisible: boolean;
  values: Route.RouteInfo;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formValues, setFormValues] = useState<Route.RouteInfo>({
    id: props.values.id,
    name: props.values.name,
    method: props.values.method,
    path: props.values.path,
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
          method: formValues.method,
          path: formValues.path,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
