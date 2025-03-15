'use client';

import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, selectedTodo, onSelectTodo }) => {
  console.log('TodoList received todos:', todos);
  
  if (!todos || todos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
        <p className="text-gray-500 dark:text-gray-400">No todos found. Add a new one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-md h-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">My Todos</h2>
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            isSelected={selectedTodo && selectedTodo._id === todo._id}
            onClick={onSelectTodo}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList; 