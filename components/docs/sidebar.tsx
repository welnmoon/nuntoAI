import Link from 'next/link';
import { source } from '@/lib/source';

type TreeNode = any;

function Tree({ node, currentPath }: { node: TreeNode; currentPath?: string }) {
  if (!node) return null;
  if (node.type === 'page') {
    const isActive = currentPath === node.url;
    return (
      <li>
        <Link
          href={node.url}
          aria-current={isActive ? 'page' : undefined}
          className={
            'text-sm hover:underline ' +
            (isActive
              ? 'text-zinc-900 dark:text-white font-medium'
              : 'text-zinc-700 dark:text-zinc-300')
          }
        >
          {node.name}
        </Link>
      </li>
    );
  }
  // folder
  return (
    <li className="mb-3">
      <div className="mt-2 mb-1 font-medium text-zinc-900 dark:text-zinc-100">{node.name}</div>
      <ul className="ml-3 space-y-1">
        {node.index?.url && (
          <li>
            <Link
              href={node.index.url}
              className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              {node.index.name ?? 'Index'}
            </Link>
          </li>
        )}
        {node.children?.map((child: TreeNode) => (
          <Tree key={child.$id ?? child.url} node={child} currentPath={currentPath} />
        ))}
      </ul>
    </li>
  );
}

export default function DocsSidebar({ currentPath }: { currentPath?: string }) {
  const tree = source.getPageTree();
  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-4">
      <ul className="space-y-2">
        {tree.children?.map((child: TreeNode) => (
          <Tree key={child.$id ?? child.url} node={child} currentPath={currentPath} />
        ))}
      </ul>
    </aside>
  );
}
