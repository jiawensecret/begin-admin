import services from '@/services/article';
import { EditOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ArticlePushDrawer from './components/ArticlePushDrawer';

const { getArticleList, getCategoryList, getArticle } =
  services.ArticleController;

const ArticleList: React.FC<unknown> = () => {
  const [categories, setCategories] = useState<Article.Category[]>([]);
  const [pushOpen, setPushOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article.Article>();
  const [pushLoadingId, setPushLoadingId] = useState<string>();
  const actionRef = useRef<ActionType>();

  const handleOpenPush = async (record: Article.Article) => {
    setPushLoadingId(record.id);
    try {
      const response = await getArticle(record.id);
      const detail = response?.data || response;
      setCurrentArticle({
        ...record,
        ...detail,
      });
      setPushOpen(true);
    } catch (error) {
      message.error('获取文章详情失败，无法生成推送预览');
    } finally {
      setPushLoadingId(undefined);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategoryList();
        setCategories(data?.list || []);
      } catch (error) {
        message.error('获取分类列表失败');
      }
    };

    fetchCategories();
  }, []);

  return (
    <PageContainer
      header={{
        title: '文章管理',
      }}
    >
      <ProTable<Article.Article>
        headerTitle="文章列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              window.location.href = '/articles/create';
            }}
          >
            新建文章
          </Button>,
        ]}
        request={async (params) => {
          const { data, success } = await getArticleList({
            page: params.current,
            page_size: params.pageSize,
            title: params.title,
            status: params.status,
            category_id: params.category_id,
            series: params.series,
          });
          const list = Array.isArray(data) ? data : data?.list || [];
          return {
            data: list,
            total: Array.isArray(data) ? list.length : data?.total || 0,
            success,
          };
        }}
        columns={[
          {
            title: '标题',
            dataIndex: 'title',
            ellipsis: true,
            copyable: true,
          },
          {
            title: '摘要',
            dataIndex: 'summary',
            ellipsis: true,
            width: 200,
          },
          {
            title: '分类',
            dataIndex: 'category_id',
            valueEnum: categories.reduce((acc, category) => {
              acc[category.id] = { text: category.name };
              return acc;
            }, {} as any),
            filters: categories.map((category) => ({
              text: category.name,
              value: category.id,
            })),
            onFilter: (value, record) => record.category_id === value,
            render: (_, record) => {
              const category = categories.find(
                (c) => c.id === record.category_id,
              );
              return category?.name || '-';
            },
          },
          {
            title: '系列',
            dataIndex: 'series',
            render: (_, record) => {
              return record.series || '-';
            },
            filters: [],
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
              1: { text: '草稿', status: 'Default' },
              2: { text: '已发布', status: 'Success' },
            },
            filterDropdown: true,
            filters: [
              { text: '草稿', value: 1 },
              { text: '已发布', value: 2 },
            ],
            onFilter: (value, record) => record.status === value,
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'dateTime',
            sorter: true,
          },
          {
            title: '更新时间',
            dataIndex: 'updated_at',
            valueType: 'dateTime',
            sorter: true,
          },
          {
            title: '作者',
            dataIndex: 'author',
          },
          {
            title: '分发状态',
            dataIndex: 'push_status',
            search: false,
            render: (_, record) => {
              if (!record.push_status?.length) return <Tag>未推送</Tag>;
              return record.push_status.map((item) => (
                <Tag
                  key={`${record.id}-${item.channel}`}
                  color={
                    item.status === 'success'
                      ? 'success'
                      : item.status === 'failed'
                      ? 'error'
                      : 'processing'
                  }
                >
                  {item.channel}
                </Tag>
              ));
            },
          },
          {
            title: '操作',
            valueType: 'option',
            render: (_, record) => (
              <>
                <a
                  onClick={() => {
                    window.location.href = `/articles/edit/${record.id}`;
                  }}
                >
                  <EditOutlined /> 编辑
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() => {
                    window.location.href = `/articles/editor/${record.id}`;
                  }}
                >
                  <EditOutlined /> 编辑内容
                </a>
                <Divider type="vertical" />
                <a onClick={() => handleOpenPush(record)}>
                  <SendOutlined />{' '}
                  {pushLoadingId === record.id ? '加载中' : '推送'}
                </a>
              </>
            ),
          },
        ]}
      />
      <ArticlePushDrawer
        article={currentArticle}
        open={pushOpen}
        onClose={() => setPushOpen(false)}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default ArticleList;
