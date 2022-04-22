import React from 'react'
import {
    NodeCollapseOutlined,
    FolderOpenOutlined,
    PicLeftOutlined,
    PicRightOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { ITreeTools } from './types';
import { TOOLTIP_COLLAPSE_FOLDERS, TOOLTIP_HIDE_SIDER_BAR, TOOLTIP_OPEN_LOCAL_FOLDER, TOOLTIP_SHOW_SIDER_BAR } from '../contants';

const TreeTools: React.FC<ITreeTools> = (props: ITreeTools) => {
    const { isHided = false, onCollapse, onHide, onOpenDisk } = props

    return (
        <div className="tree-tools">
            <div className="tree-tools__left">
                <Button type="text"
                    title={TOOLTIP_OPEN_LOCAL_FOLDER}
                    onClick={() => onOpenDisk()}
                    icon={<FolderOpenOutlined />} />
            </div>
            <div className="tree-tools__right">
                <Button type="text" title={TOOLTIP_COLLAPSE_FOLDERS} onClick={() => onCollapse()} icon={<NodeCollapseOutlined />} />
                {
                    isHided
                        ?
                        <Button type="text" icon={<PicLeftOutlined title={TOOLTIP_SHOW_SIDER_BAR} onClick={() => onHide(false)} />} />
                        :
                        <Button type="text" icon={<PicRightOutlined title={TOOLTIP_HIDE_SIDER_BAR} onClick={() => onHide(true)} />} />
                }
            </div>
        </div>
    )
}
export default TreeTools