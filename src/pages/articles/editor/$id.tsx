import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Button, Divider, message, Space, Spin, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'umi';
// 确保这个包已安装: npm install @uiw/react-markdown-editor
import services from '@/services/article';
import { getArticleMarkdown } from '@/utils/articleRender';
import {
  ArrowLeftOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import MarkdownEditor from '@uiw/react-markdown-editor';
import './style.less';

const { Title, Text } = Typography;
// 增加安全检查，防止 services 导入失败导致整个模块崩溃
const { getArticle, updateArticle, createArticle } =
  services.ArticleController || {};

const ArticleEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>(); // id 可能是 undefined
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [status, setStatus] = useState<1 | 2>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [articleId, setArticleId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>(''); // 新增错误状态
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  useEffect(() => {
    console.log('[Route Debug] Current ID:', id);

    // 如果没有 ID，视为新建文章，直接跳过加载
    if (!id) {
      setLoading(false);
      setTitle('新建文章');
      setContent('# 开始写作...\n');
      return;
    }

    const fetchArticle = async () => {
      try {
        if (!getArticle) throw new Error('API 服务未正确初始化');

        console.log('[API] Calling getArticle with id:', id);
        const response = await getArticle(id);
        console.log('[API] Response:', response);

        // 兼容不同的响应结构，防止 data 为空报错
        const data = response?.data || response;
        if (!data) throw new Error('接口返回数据为空');

        setTitle(data.title || '无标题');
        setContent(getArticleMarkdown(data.content));
        setSummary(data.summary || '');
        setStatus(data.status === 2 ? 2 : 1);
        setArticleId(id);
      } catch (error: any) {
        console.error('[Error] Fetch failed:', error);
        setErrorMsg(`加载失败: ${error.message || '未知错误'}`);
        // 即使失败也停止 loading，让用户看到错误提示或空表单
        setTitle(`编辑文章 (ID: ${id})`);
        setContent('# 加载内容失败，请手动输入\n');
      } finally {
        setLoading(false);
        console.log('[State] Loading finished');
      }
    };

    fetchArticle();
  }, [id]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (!updateArticle && !createArticle) throw new Error('API 缺失');
      const payload = {
        title,
        content,
        summary,
        status,
      };
      if (articleId || id) {
        await updateArticle(articleId || id!, payload);
      } else {
        const response = await createArticle(payload);
        const createdId = response?.data?.id;
        if (createdId) setArticleId(String(createdId));
      }
      message.success('保存成功');
    } catch (e: any) {
      message.error(e.message || '保存失败');
    } finally {
      setSaving(false);
    }
  }, [articleId, content, id, saving, status, summary, title]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSaveShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's';
      if (!isSaveShortcut) return;

      event.preventDefault();
      handleSave();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const handleBack = () => navigate('/articles');

  // 1. 加载状态
  if (loading) {
    return (
      <PageContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        >
          <Spin size="large" tip="正在加载文章数据..." />
        </div>
      </PageContainer>
    );
  }

  // 2. 主渲染
  return (
    <PageContainer
      header={{
        title: <Title level={4}>{id ? '编辑文章' : '新建文章'}</Title>,
      }}
      className={`article-editor${
        fullscreen ? ' article-editor-fullscreen' : ''
      }`}
    >
      {errorMsg && (
        <Alert
          message={errorMsg}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <ProCard
        bordered
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          background: '#1f1f1f',
          borderColor: '#303030',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
        className="article-editor-card"
      >
        {/* 顶部工具栏 */}
        <div className="article-editor-toolbar">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <Divider type="vertical" />
            <Text type="secondary">ID: {id || 'NEW'}</Text>
          </Space>
          <Space>
            <Button
              icon={
                fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
              }
              onClick={() => setFullscreen((value) => !value)}
            >
              {fullscreen ? '退出全屏' : '全屏'}
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
            >
              提交
            </Button>
          </Space>
        </div>

        {/* 编辑区域 */}
        <div className="article-editor-body">
          <div className="article-editor-frame" data-color-mode="dark">
            <MarkdownEditor
              className="article-markdown-editor"
              value={content}
              onChange={(val) => setContent(val || '')}
              height={fullscreen ? 'calc(100vh - 178px)' : '72vh'}
              previewProps={{
                wrapperElement: { 'data-color-mode': 'dark' },
              }}
            />
          </div>
        </div>
      </ProCard>
    </PageContainer>
  );
};

export default ArticleEditor;
