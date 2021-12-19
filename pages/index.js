import React from "react";
import Editor from "@monaco-editor/react";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

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
// const p5Template = `
// import * as p5 from 'p5';

// function setup() {
//   createCanvas(400, 400);
// }

// function draw() {
//   background(220);
// }

// window.setup = setup
// window.draw = draw`;

export default function Home() {
  const [editorValue, setEditorValue] = React.useState(p5Template);
  const editorRef = React.useRef();

  const [value, setValue] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [color, setColor] = React.useState("#ffb61e");

  // TODOs:
  // - Monaco is mounted
  // - connect with webrtc
  // - set value after loading from database
  // - tell it's ready

  function connect() {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(value, ydoc, { password });
    const ytext = ydoc.getText("monaco");

    provider.awareness.setLocalStateField("user", {
      name: color,
      color,
    });

    const monacoBinding = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );

    window.example = { provider, ydoc, ytext, monacoBinding };
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value, event) => {
    setEditorValue(value);
  };

  const handleSetValue = () => {
    setEditorValue(p5Template);
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
        <button onClick={handleSetValue}>Set value</button>
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
        .yRemoteSelection.red {
          border-color: red;
          background-color: red;
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
