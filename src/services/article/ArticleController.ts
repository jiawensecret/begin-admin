import { request } from 'umi';

export default {
  /**
   * 创建文章
   */
  createArticle: async (params: Partial<Article.Article>) => {
    return request<Article.Response<Article.Article>>('/api/article', {
      method: 'POST',
      data: params,
    });
  },

  /**
   * 更新文章
   */
  updateArticle: async (id: string, params: Partial<Article.Article>) => {
    return request<Article.Response<Article.Article>>(`/api/article/${id}`, {
      method: 'PUT',
      data: params,
    });
  },

  /**
   * 删除文章
   */
  deleteArticle: async (id: string) => {
    return request<Article.Response<void>>(`/api/articles/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * 获取文章详情
   */
  getArticle: async (id: string) => {
    return request<Article.Response<Article.Article>>(`/api/article/${id}`, {
      method: 'GET',
    });
  },

  /**
   * 获取文章列表
   */
  getArticleList: async (params: Article.ListParams) => {
    return request<Article.Response<Article.ListResponse>>('/api/articles', {
      method: 'GET',
      params,
    });
  },

  /**
   * 获取分类列表
   */
  getCategoryList: async () => {
    return request<Article.Response<Article.CategoryListResponse>>(
      '/api/article/categories',
      {
        method: 'GET',
      },
    );
  },

  /**
   * 推送文章到微信公众号
   */
  pushToWechat: async (params: Article.WechatPushParams) => {
    return request<Article.Response<Article.WechatPushResponse>>(
      `/api/articles/${params.article_id}/push`,
      {
        method: 'POST',
        data: params,
      },
    );
  },
};
