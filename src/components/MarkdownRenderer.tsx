"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/contrib/mhchem";
import { resolveImageSrc } from "@/lib/utils/imageUtils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={`markdown-content question-typography ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[
          [
            rehypeKatex,
            {
              strict: false,
              throwOnError: false,
              output: "htmlAndMathml",
            },
          ],
        ]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="cds--link"
              style={{ textDecoration: "underline" }}
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveImageSrc(typeof src === "string" ? src : undefined)}
              alt={alt || "Diagram"}
              style={{
                maxWidth: "100%",
                maxHeight: "360px",
                objectFit: "contain",
                border: "1px solid var(--cds-border-subtle-01)",
                backgroundColor: "var(--cds-layer-02)",
                padding: "0.5rem",
                margin: "1rem auto",
                display: "block",
              }}
            />
          ),
          ol: ({ children }) => (
            <ol className="cds--list--ordered" style={{ margin: "1rem 0", paddingLeft: "1.75rem" }}>
              {children}
            </ol>
          ),
          ul: ({ children }) => (
            <ul
              className="cds--list--unordered"
              style={{ margin: "1rem 0", paddingLeft: "1.75rem" }}
            >
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li
              className="cds--list__item"
              style={{
                marginBottom: "0.75rem",
                lineHeight: 1.75,
              }}
            >
              {children}
            </li>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: "auto", margin: "1rem 0" }}>
              <table
                className="cds--data-table cds--data-table--compact"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              style={{
                backgroundColor: "var(--cds-layer-02, #e0e0e0)",
                padding: "8px 12px",
                textAlign: "left",
                borderBottom: "2px solid var(--cds-border-strong-01, #8d8d8d)",
                fontWeight: 600,
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid var(--cds-border-subtle-01, #e0e0e0)",
              }}
            >
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "4px solid var(--cds-interactive, #0f62fe)",
                paddingLeft: "1rem",
                margin: "1rem 0",
                color: "var(--cds-text-secondary, #525252)",
                fontStyle: "italic",
                backgroundColor: "var(--cds-layer-01, #f4f4f4)",
                padding: "0.75rem 1rem",
              }}
            >
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <div style={{ margin: "1rem 0", overflowX: "auto" }}>{children}</div>
          ),
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  style={{
                    backgroundColor: "var(--cds-layer-02, #e0e0e0)",
                    color: "var(--cds-text-primary, #161616)",
                    border: "1px solid var(--cds-border-subtle-01, #e0e0e0)",
                    padding: "2px 6px",
                    fontFamily: "var(--op-font-sans)",
                    fontSize: "0.9em",
                  }}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre
                style={{
                  backgroundColor: "var(--cds-layer-01, #f4f4f4)",
                  color: "var(--cds-text-primary, #161616)",
                  border: "1px solid var(--cds-border-subtle-01, #e0e0e0)",
                  borderLeft: "4px solid var(--cds-interactive, #0f62fe)",
                  padding: "1rem",
                  overflowX: "auto",
                  fontFamily: "var(--op-font-sans)",
                  fontSize: "0.9em",
                  lineHeight: 1.5,
                  borderRadius: 0,
                  margin: 0,
                }}
              >
                <code style={{ fontFamily: "inherit" }}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
export default MarkdownRenderer;
