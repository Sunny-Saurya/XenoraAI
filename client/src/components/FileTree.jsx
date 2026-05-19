import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

const FileTreeNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDir = node.type === 'tree';

  return (
    <div>
      <div 
        className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => isDir && setIsOpen(!isOpen)}
      >
        {isDir ? (
          isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <span className="w-4 h-4" /> // Spacer for alignment
        )}
        {isDir ? (
          <Folder className="w-4 h-4 text-blue-500" />
        ) : (
          <File className="w-4 h-4 text-gray-400" />
        )}
        <span className="truncate">{node.path.split('/').pop()}</span>
      </div>
      {isOpen && isDir && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree = ({ tree }) => {
  if (!tree || tree.length === 0) return <div className="text-sm text-gray-500">No files found.</div>;

  // Reconstruct tree structure from flat paths (simplified for brevity)
  // For production, a proper path-to-tree builder is needed.
  // Here we just display them as a list if we didn't build the nested structure
  const buildTree = (paths) => {
    // simplified mock
    return paths.slice(0, 100); // only show top 100
  };

  const displayTree = buildTree(tree);

  return (
    <div className="py-2 overflow-x-hidden">
      {displayTree.map((node, index) => (
        <FileTreeNode key={index} node={node} />
      ))}
    </div>
  );
};

export default FileTree;
