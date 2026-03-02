import type { MDXComponents } from "mdx/types";
import { Mermaid } from "mdx-mermaid/lib/Mermaid";

export function useMDXComponents(): MDXComponents {
  return {
    mermaid: Mermaid,
    Mermaid,
  };
}
