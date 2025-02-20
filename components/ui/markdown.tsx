import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  children: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Helper function to generate heading ID
function generateId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }: CodeProps) {
          const match = /language-(\w+)/.exec(className || '');

          if (match && !inline) {
            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // Add IDs to headings for table of contents links
        h1({ children, ...props }) {
          const id = generateId(String(children));
          return <h1 id={id} {...props}>{children}</h1>;
        },
        h2({ children, ...props }) {
          const id = generateId(String(children));
          return <h2 id={id} {...props}>{children}</h2>;
        },
        h3({ children, ...props }) {
          const id = generateId(String(children));
          return <h3 id={id} {...props}>{children}</h3>;
        },
        h4({ children, ...props }) {
          const id = generateId(String(children));
          return <h4 id={id} {...props}>{children}</h4>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
} 