"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  codeString: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ codeString, language }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={atomOneDark as any} // ✅ TS fix
      showLineNumbers
      wrapLines
      customStyle={{
        borderRadius: "0.5rem",
        padding: "1rem",
        fontSize: "0.9rem",
      }}
    >
      {codeString}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;

