import React from "react";
import markdownit from "markdown-it";
import dompurify from "dompurify";

function Markdown({ text }: { text: string }) {
  const md = markdownit();
  console.log(text);
  const htmlContent = md.render(text);
  const sanitizedContent = dompurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }}/>;
}

export default Markdown;
