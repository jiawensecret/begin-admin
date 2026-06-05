import services from '@/services/article';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'umi';
import ArticleForm from '../components/ArticleForm';

const { getArticle, updateArticle } = services.ArticleController;

const ArticleEdit: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article.Article | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const formRef = useRef<any>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getArticle(id);
        setArticle(data);
      } catch (error) {
        message.error('获取文章详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (values: Article.Article) => {
    if (!id) return;

    const hide = message.loading('正在保存');
    try {
      await updateArticle(id, values);
      hide();
      message.success('保存成功');
      navigate('/articles');
    } catch (error) {
      hide();
      message.error('保存失败请重试！');
    }
  };

  const handleCancel = () => {
    navigate('/articles');
  };

  if (loading) {
    return <PageContainer loading />;
  }

  return (
    <PageContainer
      header={{
        title: '编辑文章基础信息',
      }}
    >
      <ProCard
        title="基础信息"
        extra={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              formRef.current?.submit();
            }}
          >
            保存
          </Button>,
        ]}
      >
        <ArticleForm
          ref={formRef}
          initialValues={article}
          onFinish={handleSubmit}
          onCancel={handleCancel}
          showContent={false}
        />
      </ProCard>
    </PageContainer>
  );
};

export default ArticleEdit;
