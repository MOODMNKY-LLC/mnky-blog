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
  author?: string;
  tags: string[];
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  lastEditedAt: string;
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

    const posts = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(pageToPost);

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

    return {
      ...post,
      content: content.parent,
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
    author: getPropertyValue<string | undefined>(
      properties.Author,
      ['people', 0, 'name'],
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
  };
} 