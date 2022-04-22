import React, { MouseEventHandler, ReactNode, useState } from 'react'
import { Tabs, TabsProps, Button } from 'antd'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect';
import cloneDeep from 'lodash/cloneDeep'
import { CloseOutlined, PicLeftOutlined } from '@ant-design/icons';
import ContextMenu from '../../ContextMenu'
import { MenuData } from '../../ContextMenu/types';
import { IFileTabs, IPosition, TabProps } from './types';
import { fileTabsContextMenuData, DISABLE_USER_SELECT, COMMAND_CLOSE_CURRENT, COMMAND_CLOSE_OTHERS, COMMAND_CLOSE_RIGHT, COMMAND_CLOSE_ALL, TOOLTIP_COLLAPSE_FOLDERS, TOOLTIP_SHOW_SIDER_BAR } from '../contants';

const { TabPane } = Tabs
const FileTabs: React.FC<IFileTabs> = (props: IFileTabs) => {

    const { activeFileTab, openedFileTabs, onSwitchTab, onTabClose, onUnTempTab, onHideSiderBar, isSiderBarHided } = props
    const [tabList, setTabList] = useState<TabProps[]>([])
    const [contextMenuPosition, setContextMenuPosition] = useState<IPosition>()
    const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
    const [contextFile, setContextFile] = useState<string>('')// 右键目标文件path
    const [closeBtnHoverTab, setCloseBtnHoverTab] = useState<string>('')

    // openFileList变化后需要生成一个tabList，需要一些特殊属性 title，key
    useDeepCompareEffect(() => {
        const tempData: TabProps[] = cloneDeep(openedFileTabs as TabProps[])
        tempData.forEach((item) => {
            item.title = item.name;
            item.key = item.path
        })
        console.log("=== tabList ===")
        console.log(tempData)
        setTabList(tempData)
    }, [openedFileTabs])

    const isTempOpen = (key: string) => {
        return openedFileTabs.find(item => item.path === key)?.isTemp
    }

    const onContextMenu: MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        // 1. 记录当前右键文件
        const { currentTarget } = event
        setContextFile(currentTarget.dataset.file as string)
        // 2. 计算菜单位置
        setContextMenuPosition({
            x: event.pageX,
            y: event.pageY
        })
        // 3. 展示菜单
        setShowContextMenu(true)
    }

    const onClose = () => {
        setContextFile('')
        setShowContextMenu(false)
    }

    const handleTabClick = (key: string) => {
        if (key !== activeFileTab) {
            onSwitchTab(key)
        }
    }

    const handleDoubleClick = (key: string) => {
        if (openedFileTabs.find(item => item.path === key)?.isTemp) {
            onUnTempTab(key)
        }
    }

    const onContextMenuClick = ({ value }: MenuData) => {
        switch (value) {
            case COMMAND_CLOSE_CURRENT:
                onTabClose(contextFile)
                break;
            case COMMAND_CLOSE_OTHERS:
                break;
            case COMMAND_CLOSE_RIGHT:
                break;
            case COMMAND_CLOSE_ALL:
                break;
            default:
                break;
        }
    }

    // isTemp 属性为 true 的 tab 需要字体倾斜
    const renderTabBar = (props: TabsProps, DefaultTabBar: any) => (
        <DefaultTabBar {...props}>
            {(node: ReactNode & { key: string }) => {
                return <div onDoubleClick={() => handleDoubleClick(node.key)} onContextMenu={onContextMenu} data-file={node.key} className={isTempOpen(node.key) ? 'font-oblique' : ''}>{node}</div>
            }}
        </DefaultTabBar >
    );

    const renderDotClose = (key: string) => <div className='dot-close' onMouseEnter={() => setCloseBtnHoverTab(key)}></div>

    // isEdited 为 true 的 tab 显示圆点，hover 时候显示 ×
    const renderCloseIcon = (isEdited: boolean, key: string) => {
        return (
            <div onClick={() => onTabClose(key)} className='close-button' >
                {!isEdited || closeBtnHoverTab === key ? <CloseOutlined onMouseLeave={() => setCloseBtnHoverTab('')} /> : renderDotClose(key)}
            </div>
        )
    }

    return (
        <div className='file-tab__container'>
            {isSiderBarHided && <Button type="text" icon={<PicLeftOutlined title={TOOLTIP_SHOW_SIDER_BAR} onClick={() => onHideSiderBar(false)} />} />}
            <Tabs
                type="editable-card"
                onTabClick={handleTabClick}
                renderTabBar={renderTabBar}
                hideAdd={true}
                tabBarStyle={DISABLE_USER_SELECT}
                activeKey={activeFileTab}
            >
                {tabList.map(pane => (
                    <TabPane tab={pane.title} key={pane.key} closeIcon={renderCloseIcon(pane.isEdited, pane.key)} >
                    </TabPane>
                ))}
            </Tabs>
            {/* 右键菜单 */}
            <ContextMenu
                data={fileTabsContextMenuData}
                position={contextMenuPosition}
                show={showContextMenu}
                onMenuClick={onContextMenuClick}
                onClose={onClose}
            />
        </div>
    )
}

export default FileTabs