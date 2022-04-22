import { gt, isUndefined } from 'lodash'
import { ETreeNodeAction, ITreeData } from './../editor/Tree/types'
import {
  AVAILABLE_FILE_EXT,
  COMMAND_ADD_FILE,
  COMMAND_ADD_FOLDER,
  COMMAND_DELETE,
  COMMAND_OPEN_DISK,
  COMMAND_RENAME,
  IMAGE_EXT,
  LABEL_ADD_FILE,
  LABEL_ADD_FOLDER,
  LABEL_DELETE,
  LABEL_OPEN_DISK,
  LABEL_RENAME,
} from './contants'

// --------------- MENU -------------------
export interface IMenuItem {
  label: string
  value: string
}

const commonMenu: IMenuItem[] = [
  { label: LABEL_RENAME, value: COMMAND_RENAME },
  { label: LABEL_DELETE, value: COMMAND_DELETE },
  { label: LABEL_OPEN_DISK, value: COMMAND_OPEN_DISK },
]

const appendMenu: IMenuItem[] = [
  { label: LABEL_ADD_FILE, value: COMMAND_ADD_FILE },
  { label: LABEL_ADD_FOLDER, value: COMMAND_ADD_FOLDER },
]

type genTreeContextMenuType = (node?: ITreeData) => IMenuItem[]

export const genTreeContextMenu: genTreeContextMenuType = (node) => {
  // 根目录
  if (node?.key === '') {
    return [...appendMenu]
  }

  let menu = [...commonMenu]

  // 文件夹
  if (!node?.isLeaf) {
    menu = [...menu, ...appendMenu]
  }

  return menu
}

/**
 * 生成一个新文件节点key，规则是 $$__{13位时间戳}__[newFile | newFolder]
 *
 */
export const genNewTreeNodePath = (type: ETreeNodeAction) => {
  return `$$__${+new Date()}__${type}`
}

// 检测是否是一个新增节点的key
export const isNewTreeNodePathRegExp = /\$\$__\d{13}__(newFile|newFolder)/

// ------------------ FILE TREE -----------------------

export function isTextFile(path: string) {
  const ext = getFileExt(path).toLowerCase()
  return AVAILABLE_FILE_EXT.indexOf(ext) !== -1
}

export function isImageFile(path: string) {
  const ext = getFileExt(path).toLowerCase()
  return IMAGE_EXT.indexOf(ext) !== -1
}

export function isFileSupport(path: string) {
  return isTextFile(path) || isImageFile(path)
}

export function isDir(path: string) {
  return path[path.length - 1] === '/'
}

export function getFileName(path: string): string {
  const arr = path.split('/')
  if (isDir(path)) {
    return arr[arr.length - 2]
  }
  return arr[arr.length - 1]
}

export function getFileParentPath(path: string): string {
  return path.substring(0, path.lastIndexOf('/'))
}

export function getFileExt(path: string) {
  const name = getFileName(path)
  return name.split('.').reverse()[0]
}

/**
 * 原始的treeData {path:string,name:string,children?:[]}
 *  没有children的节点是文件节点 ，否则是文件夹节点
 * @param {ITreeData[]} treeData
 * @return {*}
 */
export const transformOriginTreeData = (treeData: ITreeData[]) => {
  // sort: folders, files
  const files = treeData.filter((child) => isUndefined(child.children))
  const folders = treeData.filter((child) => !isUndefined(child.children))
  treeData = [
    ...folders.sort((a, b) => (gt(a.name, b.name) ? 1 : -1)),
    ...files.sort((a, b) => (gt(a.name, b.name) ? 1 : -1)),
  ]
  treeData.forEach((item: ITreeData) => {
    item.isLeaf = isUndefined(item.children)
    item.path = item.path + item.name + (!item.isLeaf ? '/' : '') // folder with "/" suffix
    if (item.children) {
      transformOriginTreeData(item.children)
    }
  })
  return treeData
}
