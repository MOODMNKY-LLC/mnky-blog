export interface PageProps {
  params: Promise<{ [key: string]: string }>
  searchParams: { [key: string]: string | string[] | undefined }
} 