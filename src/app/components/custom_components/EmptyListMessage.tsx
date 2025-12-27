
import React from 'react';

export default function EmptyListMessage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
      <p className="text-lg font-medium">Esta lista está vazia</p>
      <p className="text-sm mt-1">Arraste jogos para cá ou adicione novos.</p>
    </div>
  );
}
