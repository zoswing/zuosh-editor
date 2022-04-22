import React, { useState, useEffect } from 'react'
import ProjectEditor from './components'
import { IProjectEditorProps } from './components/editor'
import treeData from './mock/treeData.json'
import { getFileName } from './components/editor/utils'
// import ProjectEditor  from '@tencent/vos.plugin.editor'
// import '@tencent/vos.plugin.editor/style.css'


type PorpsType = Omit<IProjectEditorProps, 'onWriteFile' | 'onDeleteFile' | 'onMkdir' | 'onRenameFile' | 'onOpenDisk' | 'onUnTempTab' | 'onHideTree' | 'onSwitchTab' | 'onTabClose' | 'onCollapse' | 'onUpdateExpendedTreeNodes' | 'onTreeSelect'>

function App() {

  const [props, setProps] = useState<PorpsType>({} as IProjectEditorProps)

  const onHideTree = (state: boolean) => {
    setProps({
      ...props,
      isTreeHided: state
    })
  }

  const onRenameFile = (oldPath: string, newPath: string) => {
    console.log("rename file:",oldPath,newPath)
  }

  const onDeleteFile = (path: string) => {
    console.log("delete file:",path)
  }

  const onMkdir = (path: string) => {
    console.log("mkdir:",path)
  }

  const onWriteFile = (path: string) => {
    console.log("write file:",path)
  }

  const onSwitchTab = (key: string) => {
    console.log("tab click:", key)
    // update treeData
    setProps({
      ...props,
      activeFileTreeItem: key
    })
  }

  const onTabClose = (key: string) => {
    console.log("tab close:", key)
  }

  const onUpdateExpendedTreeNodes = (keys: React.Key[]) => {
    console.log("onUpdateExpendedTreeNodes:", keys)
    // debugger
    // setProps({
    //   ...props,
    //   expendedTreeNodes: keys
    // })
  }

  const onCollapse = () => {
    console.log("collape")
    // 这里数据只存localstorage就行，不用放到redux
    setProps({
      ...props,
      expendedTreeNodes: []
    })
  }
  const onOpenDisk = (path: string) => {
    console.log('open  on disk:', path)
  }

  const onUnTempTab = (path: string) => {
    console.log("untemp tab:", path)
    setProps({
      ...props,
      openedFileTabs: props.openedFileTabs!.map(item => {
        if (item.path === path) {
          return { ...item, isTemp: false }
        }
        return item
      })
    })
  }

  const onTreeSelect = (path: string) => {
    console.log("select file:", path)
    // get filecontent & set fileContent
    const isAlreadyOpened = props?.openedFileTabs?.some(item => item.path == path)
    setProps({
      ...props,
      fileContent: path,
      openedFileTabs: isAlreadyOpened ? props.openedFileTabs : [...new Set([...props.openedFileTabs!, {
        name: getFileName(path),
        path,
        isTemp: true,
        isEdited: false
      }])],
      activeFileTreeItem: path,
    })
    // is current fileTab is temp, replace it
  }

  useEffect(() => {
    setProps({
      treeData,
      fileContent: JSON.stringify(treeData, null, 4),
      activeFileTreeItem: '/a.json',
      activeFileTab: '/a.json',
      isTreeHided: false,
      projectPath: '/Users/zuoshaohui/code/test/miniapp-business/',
      expendedTreeNodes: [],
      openedFileTabs: [
        {
          name: "temp",
          path: '/b',
          isTemp: true,
          isEdited: false
        },
        {
          name: "edited",
          path: '/a.json',
          isTemp: false,
          isEdited: true
        },
        {
          name: "both",
          path: '/c',
          isTemp: true,
          isEdited: true
        }
      ]
    })
  }, [])



  return (
    <div className="App">
      <ProjectEditor {...props}
        onHideTree={onHideTree}
        onOpenDisk={onOpenDisk}
        onSwitchTab={onSwitchTab}
        onTreeSelect={onTreeSelect}
        onCollapse={onCollapse}
        onTabClose={onTabClose}
        onRenameFile={onRenameFile}
        onDeleteFile={onDeleteFile}
        onMkdir={onMkdir}
        onWriteFile={onWriteFile}
        onUnTempTab={onUnTempTab}
        onUpdateExpendedTreeNodes={onUpdateExpendedTreeNodes}
      />
    </div>
  )
}

export default App
