
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableContainerProps {
  children: React.ReactNode;
  id: string;
}

export default function DroppableContainer({ children, id }: DroppableContainerProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="w-full h-full min-h-[150px] transition-colors rounded-lg">
      {children}
    </div>
  );
}
