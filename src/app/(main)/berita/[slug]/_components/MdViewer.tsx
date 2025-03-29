import Markdown, { ExtraProps } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { ClassAttributes, HTMLAttributes } from "react";

import "../github-dark.min.css";

interface MdViewerProps {
  markdown: string;
}

const CustomUl = ({
  node,
  ...props
}: ClassAttributes<HTMLUListElement> &
  HTMLAttributes<HTMLUListElement> &
  ExtraProps) => (
  <ul
    style={{
      display: "block",
      listStyleType: "disc",
      paddingInlineStart: "20px",
    }}
    {...props}
  />
);

const CustomOl = ({
  node,
  ...props
}: ClassAttributes<HTMLOListElement> &
  HTMLAttributes<HTMLOListElement> &
  ExtraProps) => (
  <ol
    style={{
      display: "block",
      paddingInlineStart: "20px",
    }}
    {...props}
  />
);

const CustomPre = ({
  node,
  ...props
}: ClassAttributes<HTMLPreElement> &
  HTMLAttributes<HTMLPreElement> &
  ExtraProps) => (
  <pre className="not-prose rounded-xl overflow-hidden" {...props} />
);

const CustomCode = ({
  node,
  ...props
}: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps) => (
  <code
    className="not-prose bg-neutral-300 font-bold p-1 rounded-md"
    {...props}
  />
);

export function MdViewer({ markdown }: Readonly<MdViewerProps>) {
  return (
    <Markdown
      components={{
        ul: CustomUl,
        ol: CustomOl,
        pre: CustomPre,
        code: CustomCode,
      }}
      className="prose"
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      remarkPlugins={[remarkRehype, remarkGfm]}
    >
      {markdown}
    </Markdown>
  );
}

export default MdViewer;
