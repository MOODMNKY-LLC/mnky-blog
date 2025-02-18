export interface Post {
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