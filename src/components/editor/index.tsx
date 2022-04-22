import React, { useState } from 'react'
import SplitPane, { Pane } from 'react-split-pane-next';
import { ITreeData } from './Tree/types';
import TreeTools from './Tree/TreeTools';
import FileTabs from './FileTabs';
import CodeEditor from './CodeEditor';
import FileTree from './Tree/FileTree'
import { FileTab } from './FileTabs/types';
import '../../assets/css/split-pane.scss'
import 'antd/dist/antd.css';
import './index.scss'

export interface IFileTreeCommonCbPorps {
    onTreeSelect(path: string, isDir: boolean): void;
    onRenameFile(oldPath: string, newPath: string): void
    onMkdir(path: string): void;
    onWriteFile(path: string, data?: string): void;
    onOpenDisk(path?: string): void
    onDeleteFile(path: string): void
    onUpdateExpendedTreeNodes(keys: React.Key[]): void;
}

export interface ICommonEditorProps {
    projectPath: string;// project path  
}

export interface IBaseEditorState {
    minTreePanelWidth?: number;
    treeData?: ITreeData[];
    fileContent?: string;
    openedFileTabs: FileTab[];
    expendedTreeNodes: React.Key[];
    activeFileTreeItem: string;
    activeFileTab: string;
    isTreeHided: boolean;
}
export interface IProjectEditorProps extends IBaseEditorState, IFileTreeCommonCbPorps,ICommonEditorProps {
    onSwitchTab(file: string): void;
    onTabClose(file: string): void;
    onCollapse(): void;
    onHideTree(state: boolean): void;
    onUnTempTab(path: string): void;
}


const ProjectEditor = (props: IProjectEditorProps) => {

    const { onUpdateExpendedTreeNodes,
        expendedTreeNodes,
        onUnTempTab,
        onRenameFile,
        onMkdir,
        onWriteFile,
        onDeleteFile,
        onOpenDisk,
        onTreeSelect,
        minTreePanelWidth = 200,
        treeData = [],
        fileContent,
        openedFileTabs = [],
        onHideTree,
        activeFileTreeItem = '',
        activeFileTab = '',
        onSwitchTab,
        onTabClose,
        onCollapse,
        projectPath,
        isTreeHided = false
    } = props

    return (
        <SplitPane split="vertical" >
            {
                !isTreeHided
                &&
                <Pane minSize={`150px`} initialSize={minTreePanelWidth + 'px'} className="editor-tree-container">
                    <TreeTools
                        isHided={isTreeHided}
                        onHide={onHideTree}
                        onOpenDisk={onOpenDisk}
                        onCollapse={onCollapse} />
                    <FileTree
                        onDeleteFile={onDeleteFile}
                        onUpdateExpendedTreeNodes={onUpdateExpendedTreeNodes}
                        expendedTreeNodes={expendedTreeNodes}
                        onOpenDisk={onOpenDisk}
                        onRenameFile={onRenameFile}
                        onWriteFile={onWriteFile}
                        projectPath={projectPath}
                        onMkdir={onMkdir}
                        treeData={treeData}
                        activeFileTreeItem={activeFileTreeItem}
                        onTreeSelect={onTreeSelect} />
                </Pane>
            }
            <Pane className="editor-code-container" minSize={`150px`}>
                {
                    openedFileTabs.length
                        ?
                        <>
                            <FileTabs
                                onUnTempTab={onUnTempTab}
                                openedFileTabs={openedFileTabs}
                                onHideSiderBar={onHideTree}
                                isSiderBarHided={isTreeHided}
                                activeFileTab={activeFileTab}
                                onSwitchTab={onSwitchTab}
                                onTabClose={onTabClose} />
                            <CodeEditor code={fileContent} filePath={activeFileTab} onWriteFile={onWriteFile}></CodeEditor>
                        </>
                        : <div className='empty-container'></div>
                }
            </Pane>
        </SplitPane>
    )
}

export default ProjectEditor