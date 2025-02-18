'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BlogPost } from '@/lib/notion/client'

export function Search() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState<BlogPost[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleSearch = React.useCallback(async (value: string) => {
    setQuery(value)
    if (value.length === 0) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSelect = (post: BlogPost) => {
    setOpen(false)
    router.push(`/blog/${post.slug}`)
  }

  return (
    <>
      <Button
        variant="ghost"
        className="gap-2 glass-hover"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden md:inline-block">Search posts...</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] gap-0">
          <DialogTitle className="sr-only">Search blog posts</DialogTitle>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b pb-4">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search posts..."
                className="border-0 p-0 text-base focus-visible:ring-0"
              />
            </div>
            <ScrollArea className="max-h-[50vh]">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : results.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-6">
                  {query.length > 0 ? 'No results found.' : 'Start typing to search...'}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {results.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handleSelect(post)}
                      className="flex flex-col gap-1 rounded-lg px-4 py-2 text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{post.title}</span>
                      {post.excerpt && (
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {post.excerpt}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 