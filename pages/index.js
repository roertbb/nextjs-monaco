import React from "react";
import Editor from "@monaco-editor/react";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "../hacks/y-monaco";

const p5Template = `import p5 from 'p5';

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

  const [value, setValue] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [color, setColor] = React.useState("#ffb61e");
  const [connected, setConnected] = React.useState(false);

  function connect() {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(value, ydoc, { password });
    const ytext = ydoc.getText("monaco");

    provider.awareness.on("change", ({ added, updated, removed }) => {
      // console.log({ added, updated, removed });
      // TODO: less hacky way to update the content
      // setCodeValue(editor?.getValue());
    });

    const monacoBinding = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );

    window.example = { provider, ydoc, ytext, monacoBinding };

    setConnected(true);
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value, event) => {
    setEditorValue(value);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <label>
          roomID:
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
        <label>
          password:
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label>
          color:
          <input
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </label>
        <button onClick={connect}>Connect</button>
      </div>
      <div style={{ display: "flex" }}>
        <Editor
          width="40vw"
          height="40vh"
          value={editorValue}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          language="javascript"
          theme="vs-dark"
          options={{}}
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
      {/* https://github.com/michaelti/y-monaco/commit/96a6a92e4cb67428ec70812886f3a8ca235a0aa1 - color for selections */}
      <style global jsx>{`
        #monaco-editor {
          width: 100%;
          height: 600px;
          border: 1px solid #ccc;
        }
        .yRemoteSelection {
          background-color: rgb(250, 129, 0, 0.5);
        }
        .yRemoteSelectionHead {
          position: absolute;
          border-left: orange solid 2px;
          border-top: orange solid 2px;
          border-bottom: orange solid 2px;
          height: 100%;
          box-sizing: border-box;
        }
        .yRemoteSelectionHead::after {
          position: absolute;
          content: " ";
          border: 3px solid orange;
          border-radius: 4px;
          left: -4px;
          top: -5px;
        }
      `}</style>
    </>
  );
}
