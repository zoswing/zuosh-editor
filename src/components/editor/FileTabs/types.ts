export interface IPosition {
  x: number
  y: number
}

export interface FileTab {
  name: string //名称
  path: string // 路径
  isTemp: boolean // 是否临时打开
  isEdited: boolean // 是否被编辑过
}

export interface TabProps extends FileTab {
  title: string
  key: string
}

export interface IFileTabs {
  activeFileTab:string; // 当前激活的tab
  openedFileTabs: FileTab[] // 需要展示的tab
  onSwitchTab(file:string): void // 点击tab时候
  onTabClose(file:string): void // 点击关闭时候
  onHideSiderBar(state:boolean):void;
  isSiderBarHided:boolean;
  onUnTempTab(path: string): void // 取消temp状态
}
