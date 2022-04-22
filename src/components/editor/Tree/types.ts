import { DataNode } from 'antd/lib/tree'
import { ReactNode } from 'react'

export interface ITreeTools {
  isHided?: boolean
  onCollapse(): void
  onOpenDisk(): void
  onHide(state: boolean): void
}

export interface ITreeNode {
  nodeName: string
  nodeKey: string
  isEditing: boolean
  modifyNode(path:string,name:string): void
}
export interface ITreeData {
  path: string
  name: string
  key?: string // 业务不需要 渲染需要
  isLeaf?: boolean
  isEditing?: boolean
  isOpen?: boolean
  title?: ReactNode
  children?: ITreeData[]
}
export interface IRightClick {
  event: React.MouseEvent
  node: DataNode
}

export enum ETreeNodeAction {
  RENAME = 'rename',
  NEW_FILE = 'newFile',
  NEW_FOLDER = 'newFolder',
}

export const isAddAction = (action: ETreeNodeAction) =>
  action === ETreeNodeAction.NEW_FILE || action === ETreeNodeAction.NEW_FOLDER
export interface FromatNodeDataOptions {
  action: ETreeNodeAction
  parentPath?: string
}
