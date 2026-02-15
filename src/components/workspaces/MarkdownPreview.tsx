import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none
      prose-headings:text-text-primary prose-headings:font-semibold
      prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
      prose-p:text-text-secondary prose-p:leading-relaxed
      prose-a:text-amber prose-a:no-underline hover:prose-a:underline
      prose-strong:text-text-primary
      prose-code:text-amber prose-code:bg-page prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono
      prose-pre:bg-page prose-pre:border prose-pre:border-border prose-pre:rounded-lg
      prose-table:border-collapse
      prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-1.5 prose-th:text-left prose-th:text-text-secondary prose-th:text-xs
      prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-1.5 prose-td:text-sm
      prose-li:text-text-secondary
      prose-hr:border-border
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
