import { useState } from 'react';
import { Tree } from 'antd';
import { TreeNode } from "../types"
import React from 'react';

interface Props {
  treeData: TreeNode[];
  onClick?: (node?: TreeNode) => void;
}

const FolderTree: React.FC<Props> = (props) => {
  const [key, setKey] = useState<React.Key>();
  return (
    <Tree 
      expandedKeys={key ? [key] : []}
      titleRender={e => <span onClick={() => {
        props.onClick?.(e);
        if (e.isLeaf) return;
        if (key === e.key) {
          setKey(undefined);
        } else {
          setKey(e.key);
        }
      }}>{e.title}</span>}
      style={{ padding: 12 }}
      treeData={props.treeData}
    />
  );
}

export default FolderTree;