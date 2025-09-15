import Link from "next/link";
import { source } from "@/lib/source";

type PageTree = ReturnType<typeof source.getPageTree>;

type TreeNode = PageTree["children"][number];

// Безопасный ключ: $id -> url (для page) -> стабильный fallback с индексом
function getNodeKey(node: TreeNode, idx: number): string {
  if (node.$id) return node.$id;
  if (node.type === "page") return node.url; // url — строка
  // для folder / separator избегаем node.name (он ReactNode)
  return `${node.type}-${idx}`;
}

function Tree({
  node,
  currentPath,
  idx = 0, // пробрасываем индекс как fallback для ключей дочерних
}: {
  node: TreeNode;
  currentPath?: string;
  idx?: number;
}) {
  if (!node) return null;

  switch (node.type) {
    case "page": {
      const isActive = currentPath === node.url;
      return (
        <li key={getNodeKey(node, idx)}>
          <Link
            href={node.url}
            aria-current={isActive ? "page" : undefined}
            className={
              "text-sm hover:underline " +
              (isActive
                ? "text-zinc-900 dark:text-white font-medium"
                : "text-zinc-700 dark:text-zinc-300")
            }
          >
            {node.name}
          </Link>
        </li>
      );
    }

    case "folder": {
      return (
        <li key={getNodeKey(node, idx)} className="mb-3">
          <div className="mt-2 mb-1 font-medium text-zinc-900 dark:text-zinc-100">
            {node.name}
          </div>
          <ul className="ml-3 space-y-1">
            {node.index?.url && (
              <li>
                <Link
                  href={node.index.url}
                  className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline"
                >
                  {node.index.name ?? "Index"}
                </Link>
              </li>
            )}
            {node.children?.map((child, i) => (
              <Tree
                key={getNodeKey(child, i)}
                node={child}
                currentPath={currentPath}
                idx={i}
              />
            ))}
          </ul>
        </li>
      );
    }

    case "separator": {
      return (
        <li
          key={getNodeKey(node, idx)}
          className="mt-2 mb-1 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          {node.name}
        </li>
      );
    }

    default:
      return null;
  }
}

export default function DocsSidebar({ currentPath }: { currentPath?: string }) {
  const tree = source.getPageTree();
  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-4">
      <ul className="space-y-2">
        {tree.children?.map((child, i) => (
          <Tree
            key={getNodeKey(child, i)}
            node={child}
            currentPath={currentPath}
            idx={i}
          />
        ))}
      </ul>
    </aside>
  );
}
