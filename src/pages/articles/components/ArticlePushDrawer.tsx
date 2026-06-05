import services from '@/services/article';
import {
  ArticleChannel,
  articleChannels,
  articleTemplates,
  getArticleMarkdown,
  renderArticleForChannel,
} from '@/utils/articleRender';
import { EyeOutlined, SendOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Drawer,
  Form,
  message,
  Select,
  Space,
  Typography,
} from 'antd';
import React, { useMemo, useState } from 'react';

const { Text } = Typography;
const { pushToWechat } = services.ArticleController;

interface ArticlePushDrawerProps {
  article?: Article.Article;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ArticlePushDrawer: React.FC<ArticlePushDrawerProps> = ({
  article,
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [previewChannel, setPreviewChannel] =
    useState<ArticleChannel>('wechat');
  const [pushing, setPushing] = useState(false);

  const templateId =
    Form.useWatch('template_id', form) || articleTemplates[0].id;
  const previewHtml = useMemo(
    () =>
      renderArticleForChannel(
        {
          title: article?.title || '',
          summary: article?.summary,
          content: getArticleMarkdown(article?.content),
          cover_image: article?.cover_image,
          author: article?.author,
        },
        templateId,
        previewChannel,
      ),
    [article, previewChannel, templateId],
  );

  const handlePush = async () => {
    if (!article?.id) return;
    const values = await form.validateFields();
    setPushing(true);
    const hide = message.loading('正在推送');

    try {
      await pushToWechat({
        article_id: article.id,
        channels: values.channels,
        template_id: values.template_id,
        preview_html: previewHtml,
      });
      hide();
      message.success('推送成功，状态已提交后端更新');
      onSuccess?.();
      onClose();
    } catch (error) {
      hide();
      message.error('推送失败请重试');
    } finally {
      setPushing(false);
    }
  };

  return (
    <Drawer
      width="78vw"
      open={open}
      title="文章推送分发"
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={pushing}
            onClick={handlePush}
          >
            推送
          </Button>
        </Space>
      }
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px minmax(0, 1fr)',
          gap: 24,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            channels: ['wechat'],
            template_id: articleTemplates[0].id,
          }}
        >
          <Form.Item label="文章">
            <Text strong>{article?.title || '-'}</Text>
          </Form.Item>

          <Form.Item
            name="channels"
            label="推送渠道"
            rules={[{ required: true, message: '请选择推送渠道' }]}
          >
            <Checkbox.Group options={articleChannels} />
          </Form.Item>

          <Form.Item
            name="template_id"
            label="样式模板"
            rules={[{ required: true, message: '请选择样式模板' }]}
          >
            <Select
              options={articleTemplates.map((template) => ({
                label: template.name,
                value: template.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="预览平台">
            <Select
              value={previewChannel}
              onChange={setPreviewChannel}
              options={articleChannels.map(({ label, value }) => ({
                label,
                value,
              }))}
            />
          </Form.Item>

          <Text type="secondary">
            当前知乎和 B
            站作为多渠道结构预留，后端渠道可用后只需要放开禁用状态并复用同一套推送数据。
          </Text>
        </Form>

        <div>
          <Space style={{ marginBottom: 12 }}>
            <EyeOutlined />
            <Text strong>动态样式预览</Text>
          </Space>
          <iframe
            title="article-push-preview"
            srcDoc={previewHtml}
            style={{
              width: '100%',
              height: '72vh',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              background: '#fff',
            }}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default ArticlePushDrawer;
