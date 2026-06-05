export type ArticleChannel = 'wechat' | 'zhihu' | 'bilibili';

export interface ArticleTemplate {
  id: string;
  name: string;
  description: string;
  accent: string;
  fontFamily: string;
}

export interface RenderArticleInput {
  title: string;
  summary?: string;
  content?: string | Article.ArticleContent;
  cover_image?: string;
  author?: string;
}

export const articleChannels: Array<{
  label: string;
  value: ArticleChannel;
  disabled?: boolean;
}> = [
  { label: '微信公众号', value: 'wechat' },
  { label: '知乎', value: 'zhihu', disabled: true },
  { label: 'B站', value: 'bilibili', disabled: true },
];

export const articleTemplates: ArticleTemplate[] = [
  {
    id: 'wechat-clean',
    name: '自定义',
    description: '适合公众号技术文章，标题、引用、代码块按自定义模板渲染。',
    accent: '#1e80ff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  {
    id: 'wechat-editorial',
    name: '公众号杂志模板',
    description: '更强标题层级，适合长文和观点类内容。',
    accent: '#d46b08',
    fontFamily: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
  },
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const inlineMarkdown = (value: string) => {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return html;
};

export const getArticleMarkdown = (
  content?: string | Article.ArticleContent,
) => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  return content.content || '';
};

export const markdownToHtml = (markdown = '') => {
  const lines = markdown
    .replace(/\u00a0/g, ' ')
    .replace(/\r\n/g, '\n')
    .split('\n');
  const html: string[] = [];
  let inCode = false;
  let listType: 'ul' | 'ol' | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  const openList = (type: 'ul' | 'ol') => {
    if (listType === type) return;
    closeList();
    html.push(`<${type}>`);
    listType = type;
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (line.startsWith('```')) {
      flushParagraph();
      closeList();
      html.push(inCode ? '</code></pre>' : '<pre><code>');
      inCode = !inCode;
      return;
    }

    if (inCode) {
      html.push(escapeHtml(rawLine));
      return;
    }

    if (!line) {
      flushParagraph();
      closeList();
      return;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    const quote = line.match(/^>\s+(.+)$/);
    if (quote) {
      flushParagraph();
      closeList();
      html.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
      return;
    }

    const listItem = line.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      openList('ul');
      html.push(`<li>${inlineMarkdown(listItem[1])}</li>`);
      return;
    }

    const orderedListItem = line.match(/^\d+[.)]\s+(.+)$/);
    if (orderedListItem) {
      flushParagraph();
      openList('ol');
      html.push(`<li>${inlineMarkdown(orderedListItem[1])}</li>`);
      return;
    }

    paragraph.push(line);
  });

  flushParagraph();
  closeList();
  if (inCode) html.push('</code></pre>');
  return html.join('\n');
};

export const renderArticleForChannel = (
  article: RenderArticleInput,
  templateId: string,
  channel: ArticleChannel = 'wechat',
) => {
  const template =
    articleTemplates.find((item) => item.id === templateId) ||
    articleTemplates[0];
  const content = markdownToHtml(getArticleMarkdown(article.content));
  const channelNote =
    channel === 'wechat'
      ? '微信公众号预览'
      : channel === 'zhihu'
      ? '知乎预览'
      : 'B站预览';

  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        margin: 0;
        background: #f6f7f9;
        color: #2b2f36;
        -webkit-font-smoothing: antialiased;
      }
      .article-shell {
        box-sizing: border-box;
        width: 100%;
        max-width: 760px;
        margin: 0 auto;
        padding: 32px 28px 48px;
        background: #ffffff;
        font-family: ${template.fontFamily};
        line-height: 1.82;
        word-break: break-word;
        text-align: left;
      }
      .channel-note {
        color: #8a919f;
        font-size: 13px;
        margin-bottom: 18px;
      }
      .meta {
        margin-bottom: 22px;
        color: #8a919f;
        font-size: 14px;
      }
      .cover {
        width: 100%;
        margin: 0 0 26px;
        border-radius: 8px;
        display: block;
      }
      h1, h2, h3, h4, h5, h6 {
        margin: 30px 0 14px;
        line-height: 1.45;
        color: ${template.accent};
        font-weight: 700;
        text-align: center;
      }
      h1 {
        font-size: 22px;
      }
      h2 {
        font-size: 20px;
      }
      h3 {
        font-size: 18px;
      }
      h4 { font-size: 16px; }
      h5, h6 { font-size: 15px; }
      p {
        margin: 14px 0;
        font-size: 15px;
        font-weight: 700;
        color: #2b2f36;
      }
      strong { color: #111827; font-weight: 700; }
      em { color: #4e5969; }
      a { color: ${template.accent}; text-decoration: none; }
      img {
        max-width: 100%;
        border-radius: 8px;
        margin: 16px auto;
        display: block;
      }
      blockquote {
        margin: 20px 0;
        padding: 12px 16px;
        background: #f7f8fa;
        border-left: 4px solid ${template.accent};
        border-radius: 0 6px 6px 0;
        color: #4e5969;
      }
      blockquote p { margin: 0; color: inherit; }
      ul {
        padding-left: 22px;
        margin: 14px 0;
      }
      ol {
        margin: 18px 0;
        padding: 14px 18px 14px 42px;
        background: #f4f8ff;
        border: 1px solid #d8e8ff;
        border-radius: 8px;
      }
      li {
        margin: 7px 0;
        color: #2b2f36;
      }
      li::marker { color: ${template.accent}; }
      code {
        padding: 2px 6px;
        background: #f2f3f5;
        border-radius: 4px;
        color: #d83931;
        font-family: Menlo, Monaco, Consolas, monospace;
        font-size: 14px;
      }
      pre {
        overflow: auto;
        margin: 18px 0;
        padding: 16px;
        background: #f6f8fa;
        color: #24292f;
        border: 1px solid #e5e6eb;
        border-radius: 8px;
        line-height: 1.7;
      }
      pre code {
        padding: 0;
        background: transparent;
        color: inherit;
        font-size: 14px;
      }
      hr {
        border: none;
        border-top: 1px solid #e5e6eb;
        margin: 28px 0;
      }
    </style>
  </head>
  <body>
    <article class="article-shell">
      <div class="channel-note">${channelNote} / ${escapeHtml(
    template.name,
  )}</div>
      ${
        article.author
          ? `<div class="meta">${escapeHtml(article.author)}</div>`
          : ''
      }
      ${
        article.cover_image
          ? `<img class="cover" src="${escapeHtml(
              article.cover_image,
            )}" alt="cover" />`
          : ''
      }
      ${content || '<p>暂无正文内容</p>'}
    </article>
  </body>
</html>`;
};
