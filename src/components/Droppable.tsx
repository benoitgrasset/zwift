import { useDroppable } from "@dnd-kit/core";

export const Droppable = ({ children }: { children: React.ReactNode }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
    backgroundColor: isOver ? "lightgreen" : undefined,
    border: "2px dashed #bfbfbf",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};
