import services from '@/services/article';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef } from 'react';
import { useNavigate } from 'umi';
import ArticleForm from '../components/ArticleForm';

const { createArticle } = services.ArticleController;

const ArticleCreate: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const formRef = useRef<any>(null);

  const handleSubmit = async (values: Article.Article) => {
    console.log('提交的数据:', values);
    const hide = message.loading('正在保存');
    try {
      await createArticle(values);
      hide();
      message.success('保存成功');
      navigate('/articles');
    } catch (error) {
      console.error('保存失败:', error);
      hide();
      message.error('保存失败请重试！');
    }
  };

  const handleCancel = () => {
    navigate('/articles');
  };

  return (
    <PageContainer
      header={{
        title: '新建文章',
      }}
    >
      <ProCard
        title="文章内容"
        extra={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              // 直接调用 ArticleForm 组件的 submit 方法
              if (formRef.current) {
                formRef.current.submit();
              }
            }}
          >
            保存
          </Button>,
        ]}
      >
        <ArticleForm
          ref={formRef}
          onFinish={handleSubmit}
          onCancel={handleCancel}
        />
      </ProCard>
    </PageContainer>
  );
};

export default ArticleCreate;
