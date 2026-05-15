import { Badge } from "@/shadcn/components/ui/badge";
import { Separator } from "@/shadcn/components/ui/separator";
import ReactMarkdown from "react-markdown";

interface MarkdownPageComponentProps {
  content: string;
  title?: string;
}

export default function MarkdownPageComponent({
  content,
}: MarkdownPageComponentProps) {
  return (
    <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6 md:py-24">
      <article>
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="scroll-m-20 text-3xl font-bold tracking-tight text-foreground mb-6 mt-10 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground mb-4 mt-8 first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="scroll-m-20 text-xl font-semibold tracking-tight text-foreground mb-3 mt-6">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight text-foreground mb-2 mt-4">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="leading-7 text-muted-foreground mb-4 [&:not(:first-child)]:mt-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="my-4 ml-6 list-disc space-y-2 text-muted-foreground [&>li]:mt-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-4 ml-6 list-decimal space-y-2 text-muted-foreground [&>li]:mt-2">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-7">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  href?.startsWith("http") ? "noopener noreferrer" : undefined
                }
              >
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">
                {children}
              </strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            blockquote: ({ children }) => (
              <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground">
                {children}
              </blockquote>
            ),
            hr: () => <Separator className="my-8" />,
            code: ({ children, className }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <Badge
                    variant="secondary"
                    className="font-mono text-xs px-1.5 py-0.5"
                  >
                    {children}
                  </Badge>
                );
              }
              return (
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="mb-4 mt-4 overflow-x-auto rounded-lg border bg-muted p-4">
                {children}
              </pre>
            ),
            table: ({ children }) => (
              <div className="my-6 w-full overflow-y-auto">
                <table className="w-full border-collapse text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b">{children}</thead>
            ),
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => (
              <tr className="border-b transition-colors hover:bg-muted/50">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="p-4 align-middle text-muted-foreground">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
