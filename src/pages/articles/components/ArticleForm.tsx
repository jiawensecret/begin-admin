import services from '@/services/article';
import { getArticleMarkdown } from '@/utils/articleRender';
import { AutoComplete, Form, Input, Select, message } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const { TextArea } = Input;
const { Option } = Select;

interface ArticleFormProps {
  initialValues?: Article.Article;
  onFinish: (values: Article.Article) => void;
  onCancel: () => void;
  showContent?: boolean;
}

interface ArticleFormRef {
  submit: () => void;
}

const ArticleForm = forwardRef<ArticleFormRef, ArticleFormProps>(
  ({ initialValues, onFinish, showContent = true }, ref) => {
    const [form] = Form.useForm();

    // 暴露 submit 方法给父组件
    useImperativeHandle(ref, () => ({
      submit: () => {
        form.submit();
      },
    }));

    const [categories, setCategories] = useState<Article.Category[]>([]);
    const [seriesOptions, setSeriesOptions] = useState<string[]>([]);
    const [allSeries, setAllSeries] = useState<string[]>([]);

    const { getCategoryList } = services.ArticleController;

    useEffect(() => {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          content: getArticleMarkdown(initialValues.content),
        });
      }
    }, [initialValues, form]);

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

    // 模拟获取所有系列标签（实际项目中可从接口获取）
    useEffect(() => {
      const mockSeries = [
        '前端',
        '后端',
        'Markdown',
        'React',
        'Vue',
        'Node.js',
      ];
      setAllSeries(mockSeries);
    }, []);

    const handleSeriesChange = (value: string) => {
      // 过滤出匹配的系列标签
      if (value) {
        const filtered = allSeries.filter((series) =>
          series.toLowerCase().includes(value.toLowerCase()),
        );
        setSeriesOptions(filtered);
      } else {
        setSeriesOptions([]);
      }
    };

    return (
      <Form
        id="articleForm"
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[
            {
              required: true,
              message: '请输入标题',
            },
          ]}
        >
          <Input placeholder="请输入文章标题" />
        </Form.Item>

        <Form.Item
          name="summary"
          label="摘要"
          rules={[
            {
              required: true,
              message: '请输入摘要',
            },
          ]}
        >
          <TextArea rows={3} placeholder="请输入文章摘要" />
        </Form.Item>

        {showContent && (
          <Form.Item
            name="content"
            label="正文 Markdown"
            rules={[
              {
                required: true,
                message: '请输入正文内容',
              },
            ]}
          >
            <TextArea rows={10} placeholder="请输入 Markdown 格式正文" />
          </Form.Item>
        )}

        <Form.Item name="cover_image" label="封面图片地址">
          <Input placeholder="请输入封面图片 URL" />
        </Form.Item>

        <Form.Item
          name="category_id"
          label="分类"
          rules={[
            {
              required: false,
              message: '请选择分类',
            },
          ]}
        >
          <Select placeholder="请选择文章分类" allowClear>
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="series"
          label="系列"
          rules={[
            {
              required: false,
              message: '请输入或选择系列',
            },
          ]}
        >
          <AutoComplete
            options={seriesOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            onSelect={(value) => {
              form.setFieldsValue({ series: value });
            }}
            onSearch={handleSeriesChange}
            placeholder="请输入或选择系列"
          >
            <Input />
          </AutoComplete>
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[
            {
              required: true,
              message: '请选择状态',
            },
          ]}
        >
          <Select placeholder="请选择文章状态">
            <Option value={1}>草稿</Option>
            <Option value={2}>已发布</Option>
          </Select>
        </Form.Item>

        <Form.Item name="author" label="作者">
          <Input placeholder="请输入作者" />
        </Form.Item>
      </Form>
    );
  },
);

ArticleForm.displayName = 'ArticleForm';

export default ArticleForm;
