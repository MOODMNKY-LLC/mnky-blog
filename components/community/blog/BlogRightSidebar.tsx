import * as React from 'react';
import { Link, Hash, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseRightSidebar } from '../shared/BaseRightSidebar';
import { cn } from '@/lib/utils';

interface BlogRightSidebarProps {
  isCollapsed?: boolean;
}

interface TableOfContentsItem {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  isActive?: boolean;
}

// Example TOC data - this would come from the blog post content
const tableOfContents: TableOfContentsItem[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    level: 1,
    isActive: true,
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    level: 1,
  },
  {
    id: 'installation',
    title: 'Installation',
    level: 2,
  },
  {
    id: 'configuration',
    title: 'Configuration',
    level: 2,
  },
  {
    id: 'usage',
    title: 'Usage',
    level: 1,
  },
  {
    id: 'basic-examples',
    title: 'Basic Examples',
    level: 2,
  },
  {
    id: 'advanced-usage',
    title: 'Advanced Usage',
    level: 2,
  },
  {
    id: 'custom-components',
    title: 'Custom Components',
    level: 3,
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    level: 1,
  },
];

function TableOfContentsItem({ item }: { item: TableOfContentsItem }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start gap-2 h-auto py-1",
        item.level === 2 && "pl-4",
        item.level === 3 && "pl-6",
        item.isActive && "bg-zinc-800/50 text-zinc-100",
        !item.isActive && "text-zinc-400 hover:text-zinc-100"
      )}
      asChild
    >
      <a href={`#${item.id}`}>
        <Hash className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">{item.title}</span>
      </a>
    </Button>
  );
}

export function BlogRightSidebar({ isCollapsed }: BlogRightSidebarProps) {
  return (
    <BaseRightSidebar
      isCollapsed={isCollapsed}
      headerContent={
        !isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm font-semibold text-zinc-100">Table of Contents</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        )
      }
      footerContent={
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span>Blog Settings</span>}
        </Button>
      }
    >
      <div className="space-y-1 -mx-1">
        {tableOfContents.map((item) => (
          <TableOfContentsItem key={item.id} item={item} />
        ))}
      </div>
    </BaseRightSidebar>
  );
} 