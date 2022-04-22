import { CSSProperties } from 'react'
import { monaco } from 'react-monaco-editor'
import { MenuData } from '../ContextMenu/types'

// --------------- STYLE -----------------

export const DISABLE_USER_SELECT: CSSProperties = { userSelect: 'none' }

// --------------- MENU -----------------

// =====  file tabs =====
export const COMMAND_CLOSE_CURRENT = 'closeCurrent'
export const COMMAND_CLOSE_OTHERS = 'closeOthers'
export const COMMAND_CLOSE_RIGHT = 'closeRight'
export const COMMAND_CLOSE_ALL = 'closeAll'
// =====  file tree =====
export const COMMAND_RENAME = 'rename'
export const COMMAND_DELETE = 'delete'
export const COMMAND_ADD_FILE = 'addFile'
export const COMMAND_ADD_FOLDER = 'addFolder'
export const COMMAND_OPEN_DISK = 'openDisk'

// =====  file tabs =====
export const LABEL_CLOSE = '关闭'
export const LABEL_CLOSE_OTHER = '关闭其他'
export const LABEL_CLOSE_RIGHT = '关闭右侧'
export const LABEL_CLOSE_ALL = '关闭全部'
// =====  file tree =====
export const LABEL_RENAME = '重命名'
export const LABEL_DELETE = '删除'
export const LABEL_ADD_FILE = '新建文件'
export const LABEL_ADD_FOLDER = '新建文件夹'
export const LABEL_OPEN_DISK = '在磁盘中打开'

export const fileTabsContextMenuData: MenuData[] = [
  { label: LABEL_CLOSE, value: COMMAND_CLOSE_CURRENT },
  { label: LABEL_CLOSE_OTHER, value: COMMAND_CLOSE_OTHERS },
  { label: LABEL_CLOSE_RIGHT, value: COMMAND_CLOSE_RIGHT },
  { label: LABEL_CLOSE_ALL, value: COMMAND_CLOSE_ALL },
]

// --------------- TOOLTIP -----------------

export const TOOLTIP_OPEN_LOCAL_FOLDER = '打开磁盘目录'
export const TOOLTIP_COLLAPSE_FOLDERS = '折叠文件夹'
export const TOOLTIP_HIDE_SIDER_BAR = '隐藏导航栏'
export const TOOLTIP_SHOW_SIDER_BAR = '显示导航栏'

// --------------- MONACO EDITOR -----------------

export const AVAILABLE_FILE_EXT = [
  'text',
  'json',
  'js',
  'wxml',
  'qml',
  'wxss',
  'qss',
  'wxs',
  'qs',
  'ts',
  'md',
  'txt',
  'log',
  'gitignore',
  'eslintignore',
  'eslintignore',
  'npmignore',
]

export const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'bmp']

export const EDITOR_SHORT_SAVE = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS
