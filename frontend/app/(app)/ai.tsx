import React from "react";
import AIPage from "./components/AIPage";

const content = `
Here’s some text before code.

\`\`\`javascript
const add = (a, b) => a + b;
console.log(add(2, 3));
\`\`\`

And here’s some text after code.
`;

const App: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>My AI Page</h1>
      <AIPage content={content} />
    </div>
  );
};

export default App;
