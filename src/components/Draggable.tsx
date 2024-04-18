import { useDraggable } from "@dnd-kit/core";
import React from "react";

export const Draggable = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable ${index}`,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};
