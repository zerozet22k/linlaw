import React from "react";

function isRenderableNode(node: React.ReactNode): boolean {
  if (node == null) return false;

  if (typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return true;

  if (Array.isArray(node)) return node.some(isRenderableNode);

  if (React.isValidElement(node)) {
    // unwrap fragments
    if (node.type === React.Fragment) {
      const frag = node as React.ReactElement<{ children?: React.ReactNode }>;
      return hasRenderableChildren(frag.props.children);
    }

    return true;
  }

  return true;
}

export function hasRenderableChildren(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(isRenderableNode);
}
