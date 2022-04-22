import React, { useState, useEffect, useRef } from 'react'
import cloneDeep from 'lodash/cloneDeep';
import { useDeepCompareEffect } from 'react-use';
import { Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import ContextMenu from '../../ContextMenu'
import { ETreeNodeAction, FromatNodeDataOptions, IRightClick, isAddAction, ITreeData } from './types';
import { genNewTreeNodePath, genTreeContextMenu, getFileParentPath, isNewTreeNodePathRegExp, transformOriginTreeData } from '../utils';
import { MenuData } from '../../ContextMenu/types';
import TreeNode from './TreeNode'
import { COMMAND_ADD_FILE, COMMAND_ADD_FOLDER, COMMAND_DELETE, COMMAND_OPEN_DISK, COMMAND_RENAME } from '../contants';
import { ICommonEditorProps, IFileTreeCommonCbPorps } from '..';

const { DirectoryTree } = Tree;

export interface IFileTree extends IFileTreeCommonCbPorps, ICommonEditorProps {
    treeData?: ITreeData[];
    activeFileTreeItem?: string;
    onOpenDisk(path?: string): void;
    onDeleteFile(path: string): void;
    expendedTreeNodes: React.Key[];
}

const FileTree = (props: IFileTree) => {
    const { onOpenDisk, onRenameFile, onMkdir, onWriteFile, onDeleteFile, projectPath, treeData, onTreeSelect, activeFileTreeItem, expendedTreeNodes = [], onUpdateExpendedTreeNodes } = props
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [contextMenuData, setContextMenuData] = useState(genTreeContextMenu())
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number }>()
    const [contextFile, setContextFile] = useState('')// 右键目标文件path
    const [activeFile, setActiveFile] = useState('')// 左键目标文件path
    const [fileTreeData, setFileTreeData] = useState<DataNode[]>([])
    const currentContextMenuCommand = useRef('')
    const addTreeNodeTo = useRef('')

    const onSelect = (keys: React.Key[], info: any) => {
        console.log('Trigger Select', keys, info);
        const filePath = keys[0] as string;
        setActiveFile(filePath)
        setSelectedKeys(keys)
        onTreeSelect(filePath, !info.node.isLeaf)
    };

    const addExpandedKey = (key: string) => {
        const newKeys = Array.from(new Set([...expendedTreeNodes, key]))
        onUpdateExpendedTreeNodes(newKeys)
    }

    const onRightClick = ({ event, node }: IRightClick) => {
        const filePath = node.key as string
        // 1. 记录当前右键文件
        setContextFile(filePath)
        // 2. 计算菜单位置
        setContextMenuPosition({
            x: event.pageX,
            y: event.pageY
        })
        // 3. 获取右键菜单
        setContextMenuData(genTreeContextMenu(node as ITreeData))
        setShowContextMenu(true)
        // 4. 将当前选中的文件高亮
        if (filePath && activeFile !== filePath) {
            setSelectedKeys([activeFile, filePath])
        }
    }

    const onContextMenuClose = () => {
        setShowContextMenu(false)
        setContextFile('')
        // 取消右键目标高亮
        setSelectedKeys([activeFile])
    }

    /**
     * 更新tree组件的数据结构 
     *  rename、addFolder、addFile
     * @param {FromatNodeDataOptions} [options]
     */
    const updateFileTreeStructor = (options?: FromatNodeDataOptions) => {
        let newFileTreeData = [...fileTreeData] as ITreeData[]
        // 根节点新增文件
        if (options?.parentPath === '' && isAddAction(options.action)) {
            const newNode = genNewFileTreeNode(options)
            addTreeNodeTo.current = projectPath
            newFileTreeData.push(newNode)
        }
        formatNodeData(newFileTreeData, options)
        setFileTreeData(newFileTreeData as DataNode[])
    }

    const onContextMenuClick = ({ value: command }: MenuData) => {
        console.log(command)
        currentContextMenuCommand.current = command as string
        switch (command) {
            case COMMAND_RENAME:
                updateFileTreeStructor({ action: ETreeNodeAction.RENAME })
                setShowContextMenu(false)
                break
            case COMMAND_ADD_FILE:
                updateFileTreeStructor({ parentPath: contextFile, action: ETreeNodeAction.NEW_FILE })
                addExpandedKey(contextFile)
                setShowContextMenu(false)
                break
            case COMMAND_ADD_FOLDER:
                updateFileTreeStructor({ parentPath: contextFile, action: ETreeNodeAction.NEW_FOLDER })
                addExpandedKey(contextFile)
                setShowContextMenu(false)
                break
            case COMMAND_OPEN_DISK:
                onOpenDisk(contextFile)
                setShowContextMenu(false)
                break
            case COMMAND_DELETE:
                onDeleteFile(contextFile)
                setShowContextMenu(false)
                break
            default:
        }
    }

    /**
     * 从fileTreeData中移除目标节点
     *
     * @param {string} targetKey
     */
    const removeTempTreeNode = (targetKey: string) => {
        const removeNode = (treeData: ITreeData[]) => {
            treeData = treeData.filter(item => item.key !== targetKey)
            treeData.forEach(item => {
                if (item.children) {
                    item.children = removeNode(item.children)
                }
            })
            return treeData
        }
        const treeData = removeNode([...fileTreeData] as ITreeData[])
        setFileTreeData(treeData as DataNode[])
    }

    const modifyNode = (key: string, value: string) => {
        // 更新节点信息 根据key判断是新增节点还是rename
        console.log("key:", key, ", value:", value)
        if (isNewTreeNodePathRegExp.test(key)) {
            // 1.key是新增节点且value为空，则删除临时添加的节点
            if (value === '') {
                removeTempTreeNode(key)
                return
            }
            // 2. add file 
            if (currentContextMenuCommand.current === COMMAND_ADD_FILE) {
                onWriteFile(addTreeNodeTo.current + value)
                return
            }
            // 3. add folder
            if (currentContextMenuCommand.current === COMMAND_ADD_FOLDER) {
                onMkdir(addTreeNodeTo.current + value + '/')
                return
            }
        }
        // 4. rename
        const parentPath = getFileParentPath(key)
        onRenameFile(key, `${parentPath}/${value}`)
    }

    const genNewFileTreeNode = (options: FromatNodeDataOptions) => {
        const newNodePath = genNewTreeNodePath(options.action as ETreeNodeAction)
        return {
            path: newNodePath,
            name: '',
            isLeaf: options.action === ETreeNodeAction.NEW_FILE,
        }
    }

    /**
       * treeData结构化
       * 1、原始文件树数据初始化
       * 2、rename时候调整当前文件的fileTreeData
       * 3、新增节点时候，对应children新增node
       *
       * @param {ITreeData[]} treeData 需要处理的数据
       * @param {FromatNodeDataOptions} [options] 新增或编辑节点参数
       * @return {*} {DataNode[]}
       */
    const formatNodeData = (treeData: ITreeData[], options?: FromatNodeDataOptions): DataNode[] => {
        treeData.forEach(node => {
            node.key = node.path
            // 如果是新增节点，或者是编辑节点，isEditing为true
            node.isEditing = isNewTreeNodePathRegExp.test(node.path) || (options?.action === ETreeNodeAction.RENAME && contextFile === node.path)
            node.title = (
                <TreeNode
                    nodeName={node.name}
                    nodeKey={node.path}
                    modifyNode={modifyNode}
                    isEditing={node.isEditing}
                />
            )
            // 如果是新增节点的话 插入一个child
            if (node.key === options?.parentPath && [ETreeNodeAction.NEW_FILE, ETreeNodeAction.NEW_FOLDER].includes(options?.action)) {
                const newNode = genNewFileTreeNode(options)
                // 需要处理下如果当前节点是空文件情况
                if (node.children) {
                    node.children.unshift(newNode)
                } else {
                    node.children = [newNode]
                }
                // 记录一下新增节点的文件夹路径
                addTreeNodeTo.current = node.key
            }
            if (node.children) {
                //  递归处理子节点
                node.children = formatNodeData(node.children, options) as ITreeData[]
            }
        })
        return treeData as DataNode[]
    }

    const onContainerRightClick = (event: React.MouseEvent) => {
        event.preventDefault()
        if (event.target === event.currentTarget) {
            // 右键不在树上，则显示菜单 key为 ''
            onRightClick({ event, node: { key: '' } })
        }
    }

    useEffect(() => {
        activeFileTreeItem && setSelectedKeys([activeFileTreeItem])
    }, [activeFileTreeItem])

    useDeepCompareEffect(() => {
        const transformedTreeData = transformOriginTreeData(cloneDeep(treeData)!)
        console.log("transformed tree data: ", transformedTreeData)
        const formatTree = formatNodeData(transformedTreeData)
        setFileTreeData(formatTree as DataNode[])
    }, [treeData])

    return (
        <div onContextMenu={onContainerRightClick} className='tree-content'>
            <DirectoryTree
                onSelect={onSelect}
                defaultExpandAll
                selectedKeys={selectedKeys}
                multiple
                onRightClick={onRightClick}
                onExpand={onUpdateExpendedTreeNodes}
                expandedKeys={expendedTreeNodes}
                treeData={fileTreeData}
            />
            <ContextMenu
                data={contextMenuData}
                position={contextMenuPosition}
                show={showContextMenu}
                onMenuClick={onContextMenuClick}
                onClose={onContextMenuClose}
            />
        </div>
    )
}


export default FileTree