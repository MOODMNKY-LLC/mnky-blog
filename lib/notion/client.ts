import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import axios from 'axios';

if (!process.env.NOTION_API_KEY) {
  throw new Error('Missing NOTION_API_KEY environment variable');
}

if (!process.env.NOTION_BLOG_DATABASE_ID) {
  throw new Error('Missing NOTION_BLOG_DATABASE_ID environment variable');
}

interface TocItem {
  id: string;
  text: string;
  level: number;
  items: TocItem[];
}

// Helper function to generate table of contents from markdown content
function generateTableOfContents(markdown: string) {
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s*{#[\w-]+})?\s*$/gm;
  const tableOfContents: TocItem[] = [];
  const stack: TocItem[] = [];
  
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    // Clean the text by removing any inline markdown
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
      .replace(/[_*~`]+/g, '') // Remove emphasis markers
      .trim();
    
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const item: TocItem = { id, text, level, items: [] };
    
    // Find the appropriate parent for this heading
    while (stack.length > 0) {
      if (stack[stack.length - 1].level < level) {
        stack[stack.length - 1].items.push(item);
        stack.push(item);
        break;
      }
      stack.pop();
    }
    
    // If no parent found, add to root level
    if (stack.length === 0) {
      tableOfContents.push(item);
      stack.push(item);
    }
  }
  
  return tableOfContents;
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
  fetch: async (url, init) => {
    try {
      const response = await axios({
        url,
        method: init?.method || 'GET',
        headers: init?.headers as Record<string, string>,
        data: init?.body,
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status >= 200 && status < 300,
      });
      return new Response(JSON.stringify(response.data), {
        status: response.status,
        headers: response.headers as HeadersInit,
      });
    } catch (error) {
      if (error instanceof Error && 'isAxiosError' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown }; message: string };
        console.error('Notion API Error:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          url,
        });
        throw new Error(`Notion API Error: ${axiosError.message}`);
      }
      throw error;
    }
  },
});

export const n2m = new NotionToMarkdown({ notionClient: notion });

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  coverImage?: string;
  heroBackground?: string;
  heroOverlay?: 'none' | 'light' | 'dark' | 'gradient';
  author?: string;
  authorBio?: string;
  category?: string;
  tags: string[];
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  lastEditedAt: string;
  readingTime?: number;
  tableOfContents?: TocItem[];
}

export interface NotionQueryOptions {
  filter?: {
    property: string;
    multi_select: {
      contains: string;
    };
  };
  sorts?: Array<{
    property: string;
    direction: 'ascending' | 'descending';
  }>;
  pageSize?: number;
  startCursor?: string;
  includeContent?: boolean;
}

export async function getPublishedBlogPosts(options: NotionQueryOptions = {}): Promise<{
  posts: BlogPost[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'Published',
            checkbox: {
              equals: true,
            },
          },
          ...(options.filter ? [options.filter] : []),
        ],
      },
      sorts: options.sorts ?? [
        {
          property: 'Publish Date',
          direction: 'descending',
        },
      ],
      page_size: options.pageSize ?? 10,
      ...(options.startCursor ? { start_cursor: options.startCursor } : {}),
    });

    const posts = await Promise.all(
      response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(async (page) => {
          const post = pageToPost(page);
          
          if (options.includeContent) {
            const mdBlocks = await n2m.pageToMarkdown(page.id);
            const content = n2m.toMarkdownString(mdBlocks);
            return {
              ...post,
              content: content.parent
            };
          }
          
          return post;
        })
    );

    return {
      posts,
      nextCursor: response.next_cursor,
      hasMore: response.has_more,
    };
  } catch (error) {
    if (error instanceof Error && 'isAxiosError' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message: string };
      console.error('Failed to fetch blog posts:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });
    } else {
      console.error('Failed to fetch blog posts:', error);
    }
    throw new Error('Failed to fetch blog posts');
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DATABASE_ID!,
      filter: {
        property: 'Slug',
        rich_text: {
          equals: slug,
        },
      },
    });

    const page = response.results[0];
    if (!page || !('properties' in page)) {
      return null;
    }

    const post = pageToPost(page as PageObjectResponse);
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const content = n2m.toMarkdownString(mdBlocks);
    const markdown = content.parent;

    return {
      ...post,
      content: markdown,
      tableOfContents: generateTableOfContents(markdown),
    };
  } catch (error) {
    if (error instanceof Error && 'isAxiosError' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message: string };
      console.error(`Failed to fetch blog post with slug ${slug}:`, {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });
    } else {
      console.error(`Failed to fetch blog post with slug ${slug}:`, error);
    }
    throw new Error('Failed to fetch blog post');
  }
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  try {
    const response = await notion.search({
      query,
      filter: {
        property: 'object',
        value: 'page',
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
    });

    return response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(pageToPost);
  } catch (error) {
    if (error instanceof Error && 'isAxiosError' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message: string };
      console.error('Failed to search blog posts:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });
    } else {
      console.error('Failed to search blog posts:', error);
    }
    throw new Error('Failed to search blog posts');
  }
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const { posts } = await getPublishedBlogPosts({
    filter: {
      property: 'Tags',
      multi_select: {
        contains: tag,
      },
    },
  });
  return posts;
}

function pageToPost(page: PageObjectResponse): BlogPost {
  const properties = page.properties;

  // Helper function to safely access property values with proper type safety
  const getPropertyValue = <T>(
    property: unknown,
    path: (string | number)[],
    defaultValue: T
  ): T => {
    try {
      const value = path.reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object') {
          return (acc as Record<string | number, unknown>)[key];
        }
        return undefined;
      }, property);
      return (value ?? defaultValue) as T;
    } catch {
      return defaultValue;
    }
  };

  // Helper function to safely get text content
  const getTextContent = (
    property: unknown,
    path: (string | number)[],
    defaultValue = ''
  ): string => {
    const value = getPropertyValue<unknown>(property, path, defaultValue);
    return String(value || defaultValue);
  };

  // Get page cover (banner) image
  const getCoverImage = (page: PageObjectResponse): string | undefined => {
    if (!page.cover) return undefined;
    
    if (page.cover.type === 'external') {
      return page.cover.external.url;
    }
    
    if (page.cover.type === 'file') {
      return page.cover.file.url;
    }
    
    return undefined;
  };

  // Calculate reading time based on content length (if available)
  const content = getTextContent(properties.Content, ['rich_text', 0, 'plain_text']);
  const readingTime = content ? Math.ceil(content.split(/\s+/).length / 200) : undefined;

  return {
    id: page.id,
    title: getTextContent(properties.Title, ['title', 0, 'plain_text']),
    slug: getTextContent(properties.Slug, ['rich_text', 0, 'plain_text']),
    publishedAt: getTextContent(properties['Publish Date'], ['date', 'start']),
    excerpt: getTextContent(properties.Excerpt, ['rich_text', 0, 'plain_text']),
    coverImage:
      getPropertyValue<string | undefined>(
        properties['Cover Image'],
        ['files', 0, 'file', 'url'],
        undefined
      ) ??
      getPropertyValue<string | undefined>(
        properties['Cover Image'],
        ['files', 0, 'external', 'url'],
        undefined
      ),
    heroBackground: getCoverImage(page),
    heroOverlay: getPropertyValue<'none' | 'light' | 'dark' | 'gradient'>(
      properties['Hero Overlay'],
      ['select', 'name'],
      'gradient'
    ),
    author: getPropertyValue<string | undefined>(
      properties.Author,
      ['people', 0, 'name'],
      undefined
    ),
    authorBio: getPropertyValue<string | undefined>(
      properties.AuthorBio,
      ['rich_text', 0, 'plain_text'],
      undefined
    ),
    category: getPropertyValue<string | undefined>(
      properties.Category,
      ['select', 'name'],
      undefined
    ),
    tags: getPropertyValue<Array<{ name: string }>>(
      properties.Tags,
      ['multi_select'],
      []
    ).map((tag) => tag.name),
    seoTitle: getTextContent(properties['SEO Title'], ['rich_text', 0, 'plain_text'], undefined),
    seoDescription: getTextContent(
      properties['SEO Description'],
      ['rich_text', 0, 'plain_text'],
      undefined
    ),
    lastEditedAt: page.last_edited_time,
    readingTime,
    tableOfContents: getPropertyValue<TocItem[]>(
      properties.TableOfContents,
      ['multi_select'],
      []
    ),
  };
} 