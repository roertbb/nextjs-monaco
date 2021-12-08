import React from "react";
import Editor from "@monaco-editor/react";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";

const p5Template = `
import p5 from 'p5';

const sketch = (s) => {
    s.setup = () => {
        s.createCanvas(500, 500);
    }

    s.draw = () => {
        s.background(0);
        s.circle(20,20,20);
    }
}

const sketchInstance = new p5(sketch);`;

export default function Home() {
  const [editorValue, setEditorValue] = React.useState(p5Template);
  const editorRef = React.useRef();

  const handleEditorDidMount = (value, editor) => {
    editorRef.current = editor;

    // monaco.init().then((monacoInstance) => {
    //   editor.addCommand(
    //     monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
    //     () => {
    //       alert("CmdCtrl + Enter Pressed!");
    //     }
    //   );
    // });
  };

  const handleEditorChange = (value, event) => {
    setEditorValue(value);
  };

  return (
    <div style={{ display: "flex" }}>
      <Editor
        width="40vw"
        height="40vh"
        value={editorValue}
        editorDidMount={handleEditorDidMount}
        onChange={handleEditorChange}
        language="javascript"
        theme="vs-dark"
      />
      <SandpackProvider
        customSetup={{
          entry: "/index.js",
          dependencies: { p5: "latest" },
          files: {
            "/index.js": {
              code: editorValue,
              active: true,
            },
          },
        }}
      >
        <SandpackPreview />
      </SandpackProvider>
    </div>
  );
}
