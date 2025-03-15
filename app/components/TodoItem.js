'use client';

import React from 'react';

const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TodoItem = ({ todo, isSelected, onClick }) => {
  // Ensure completed is a boolean
  const isCompleted = Boolean(todo.completed);
  
  return (
    <div 
      className={`p-4 mb-2 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500' 
          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      onClick={() => onClick(todo)}
    >
      <div className="flex items-center justify-between">
        <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
          {todo.title}
        </h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          isCompleted 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
        {todo.description ? todo.description.replace(/<[^>]*>/g, ' ') : ''}
      </p>
      <div className="flex items-center mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Created: {formatDate(todo.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default TodoItem; 