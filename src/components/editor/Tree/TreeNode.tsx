import React, { useState, useEffect } from 'react'
import { ITreeNode } from './types'
import Input from 'antd/lib/input/Input'
import { isNewTreeNodePathRegExp } from '../utils'

const TreeNode: React.FC<ITreeNode> = (props: ITreeNode) => {

    const { nodeName, nodeKey, isEditing, modifyNode } = props
    const [nodeInputName, setNodeInputName] = useState<string>(nodeName)
    const [showInput, setShowInput] = useState<boolean>(isEditing)

    useEffect(() => {
        setShowInput(isEditing)
    }, [isEditing])

    const onInputBlur = () => {
        // 1. 编辑节点时，编辑后的内容为空或者与原内容一致，则放弃内容
        if (!isNewTreeNodePathRegExp.test(nodeKey) && (nodeInputName === '' || nodeInputName === nodeName)) {
            setNodeInputName(nodeName)
            setShowInput(false)
            return
        }
        modifyNode(nodeKey, nodeInputName)
    }

    return (
        !!showInput
            ? <Input
                size="small"
                autoFocus
                onPressEnter={() => modifyNode(nodeKey, nodeInputName)}
                onBlur={onInputBlur}
                onChange={e => setNodeInputName(e.target.value)}
                value={nodeInputName}
            />
            :
            <span>{nodeName}</span>
    )
}

export default TreeNode