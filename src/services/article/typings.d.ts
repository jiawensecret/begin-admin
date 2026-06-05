declare namespace Article {
  interface Article {
    id: string;
    title: string;
    content?: string | ArticleContent;
    summary?: string;
    cover_image?: string;
    status: 1 | 2;
    author?: string;
    category_id?: number;
    category?: Category;
    series?: string;
    push_status?: PushRecord[];
    created_at?: string;
    updated_at?: string;
  }

  interface ArticleContent {
    id?: number;
    article_id?: number;
    content?: string;
  }

  interface ListParams {
    page?: number;
    page_size?: number;
    title?: string;
    status?: 1 | 2;
    category_id?: number;
    series?: string;
  }

  interface ListResponse {
    list: Article[];
    total: number;
  }

  interface Category {
    id: number;
    name: string;
  }

  interface CategoryListResponse {
    list: Category[];
  }

  interface WechatPushParams {
    article_id: string;
    template_id?: string;
    channels?: string[];
    preview_html?: string;
  }

  interface WechatPushResponse {
    success: boolean;
    message: string;
    channels?: PushRecord[];
  }

  interface PushRecord {
    channel: string;
    status: 'pending' | 'success' | 'failed';
    pushed_at?: string;
    external_id?: string;
    message?: string;
  }

  interface Response<T> {
    data: T;
    success: boolean;
    message?: string;
  }

  // 状态枚举
  const StatusEnum = {
    DRAFT: 1,
    PUBLISHED: 2,
  };

  // 状态映射
  const StatusMap = {
    1: '草稿',
    2: '已发布',
  };
}
