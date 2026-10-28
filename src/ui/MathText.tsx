import katex from "katex";
import { useMemo } from "react";

interface Props {
  children: string;
  display?: boolean;
}

export function MathText({ children, display = false }: Props) {
  const html = useMemo(
    () =>
      katex.renderToString(children.replace(/−/g, "-"), {
        throwOnError: false,
        displayMode: display,
      }),
    [children, display],
  );
  return <span className="math-text" dangerouslySetInnerHTML={{ __html: html }} />;
}
