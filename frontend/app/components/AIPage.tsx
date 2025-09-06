import React from "react";
import CodeBlock from "./CodeBlock";

interface AIPageProps {
  content: string;
}

const AIPage: React.FC<AIPageProps> = ({ content }) => {
  const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const before = content.substring(lastIndex, match.index);
    if (before) parts.push(<p key={lastIndex}>{before}</p>);

    parts.push(
      <CodeBlock
        key={match.index}
        language={match[1]}
        codeString={match[2]}
      />
    );

    lastIndex = match.index + match[0].length;
  }

  const remaining = content.substring(lastIndex);
  if (remaining) parts.push(<p key={lastIndex}>{remaining}</p>);

  return <div>{parts}</div>;
};

export default AIPage;
