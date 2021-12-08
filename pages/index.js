import React from "react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [editorValue, setEditorValue] = React.useState('const test = "test"');
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
    <div>
      <Editor
        width="40vw"
        height="40vh"
        value={editorValue}
        editorDidMount={handleEditorDidMount}
        onChange={handleEditorChange}
        language="javascript"
        theme="vs-dark"
      />
    </div>
  );
}
