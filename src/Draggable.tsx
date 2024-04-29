"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
// import { DragHandleDots2Icon } from "@radix-ui/react-icons";

export function Draggable({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={cn(`flex items-center justify-between gap-2`, className)}
      style={style}
    >
      {children}
      <button {...listeners} {...attributes} className="cursor-move">
        :
      </button>
    </div>
  );
}
