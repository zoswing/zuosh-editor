export interface MenuData {
  label?: string
  value?: string
  disabled?: boolean
  divider?: boolean
  subMenu?: MenuData[]
}
export declare interface MenuProps {
  data: MenuData[]
  position?: {
    x: number
    y: number
  }
  show: boolean
  onClose?: (e: any) => void
  onMenuClick?: (e: any) => void
}

export declare interface MenuItemProps {
  dataSource: MenuData
  show: boolean
  subMenu: MenuItemProps[]
}
