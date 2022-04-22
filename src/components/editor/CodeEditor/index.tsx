import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor, { EditorDidMount, ChangeHandler, monaco } from 'react-monaco-editor';
import { EDITOR_SHORT_SAVE } from '../contants';
import { isTextFile } from '../utils';

type Editor = monaco.editor.IStandaloneCodeEditor
type EditorOptions = monaco.editor.IStandaloneEditorConstructionOptions

const options: EditorOptions = {
  minimap: {
    enabled: false
  },
  wordWrap: 'on'
}

export interface ICodeEditor {
  code?: string
  filePath: string
  onWriteFile(path: string, data?: string): void;
}

const CodeEditor: React.FC<ICodeEditor> = (props: ICodeEditor) => {

  const { code='', filePath, onWriteFile } = props
  const [editor, setEditor] = useState<Editor>()
  const editorContainer = useRef<HTMLDivElement>(null)
  const editorContent = useRef<string>(code)


  const registerHotKeys=(editor:Editor)=>{
    editor.addCommand(EDITOR_SHORT_SAVE,()=>{
      onWriteFile(filePath,editorContent.current)
    })
  }

  const editorDidMount: EditorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    setEditor(editor)
    editor.onDidBlurEditorWidget(() => {
      // 失去焦点
      console.log("Monaco editor blur")
    });

    registerHotKeys(editor)
  }

  useEffect(() => {
    if (editorContainer.current) {
      let resizeObserver = new ResizeObserver(entries => {
        // 只有一个监听取第0个
        let entry = entries[0]
        const { width, height } = entry.contentRect;
        // 调整编辑器宽高
        editor?.layout({
          width,
          height
        })
      });
      resizeObserver.observe(editorContainer.current as Element)
    }
  }, [editorContainer.current])

  const onChange: ChangeHandler = (newValue, e) => {
    console.log('onChangeCode:',filePath);
    editorContent.current=newValue
  }

  const isSupported = () => {
    return filePath && isTextFile(filePath)
  }

  const renderNotSupported = () => (
    <div className="unsupport">
      <span className="unsupport__text">
        该文件类型暂不支持
      </span>
    </div>
  )

  const renderPlaceholder = () => (
    <div>
      占位
    </div>
  )

  const onResize = () => {
    // if (editor) {
    //   const rect = editorContainer.current!.getBoundingClientRect();
    //   editor.layout({
    //     width: document.body.clientWidth - rect.left,
    //     height: document.body.clientHeight - rect.top,
    //   });
    // }
  }

  const addHint = () => {
    // 代码提示
    try {
      // TODO: 读取类型定义文件
      const jsLibContent = ''
      // monaco.languages.typescript.javascriptDefaults.addExtraLib(jsLibContent);
      // monaco.languages.typescript.typescriptDefaults.addExtraLib(jsLibContent);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    addHint()
    return () => {
      window.removeEventListener('resize', onResize)
    };
  }, [])



  return (
    filePath
      ?
      (
        isSupported()
          ?
          <div ref={editorContainer} className="monaco-container">
            <MonacoEditor
              language="json"
              theme="vs-dark"
              value={code}
              options={options}
              onChange={onChange}
              editorDidMount={editorDidMount}
            />
          </div>
          : renderNotSupported()
      )
      :
      renderPlaceholder()
  );
}

export default CodeEditor