"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  children,
  style: extraStyle = {},
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "inline-flex",
    ...extraStyle,
  };

  return (
    <span ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </span>
  );
};
