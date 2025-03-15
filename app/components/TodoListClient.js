'use client';

import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../utils/api';

const TodoListClient = () => {
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formKey, setFormKey] = useState(Date.now());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(8); // Changed from 2 to 8 todos per page

    useEffect(() => {
        loadTodos(currentPage, limit);
    }, [currentPage, limit]);

    const loadTodos = async (page = 1, pageLimit = 8) => { // Changed from 2 to 8 todos per page
        try {
            setLoading(true);
            const data = await fetchTodos(page, pageLimit);

            // Log the response to debug
            console.log('Fetched todos data:', data);

            // Make sure we're setting the state with the correct data structure
            if (data && Array.isArray(data.todos)) {
                setTodos(data.todos);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 1);
            } else if (Array.isArray(data)) {
                // If the API is returning an array directly (old format)
                setTodos(data);
                // Estimate total pages based on array length
                setTotalPages(Math.ceil(data.length / pageLimit));
                setCurrentPage(page);
                console.warn('API is returning old format data (array instead of pagination object)');
            } else {
                console.error('Unexpected data format:', data);
                setTodos([]);
            }

            setError(null);
        } catch (err) {
            setError('Failed to load todos. Please try again later.');
            console.error('Error loading todos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTodo = (todo) => {
        setSelectedTodo(null);
        setTimeout(() => {
            setSelectedTodo(todo);
            setFormKey(Date.now());
        }, 10);
    };

    const handleSubmit = async (todoData) => {
        try {
            if (todoData._id) {
                const updatedTodo = await updateTodo(todoData._id, todoData);

                setTodos(prevTodos =>
                    prevTodos.map(todo =>
                        todo._id === updatedTodo._id ? updatedTodo : todo
                    )
                );

                setSelectedTodo(null);
            } else {
                const newTodo = await createTodo(todoData);

                if (currentPage === 1) {
                    setTodos(prevTodos => [newTodo, ...prevTodos.slice(0, limit - 1)]);
                } else {
                    setCurrentPage(1);
                }

                setSelectedTodo(null);
            }
            setFormKey(Date.now());
        } catch (err) {
            setError('Failed to save todo. Please try again.');
            console.error(err);
        }
    };

    const handleCancel = () => {
        setSelectedTodo(null);
        setFormKey(Date.now());
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        try {
            await deleteTodo(id);
            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));

            if (selectedTodo && selectedTodo._id === id) {
                setSelectedTodo(null);
                setFormKey(Date.now());
            }

            if (todos.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else if (todos.length === 0 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                loadTodos(currentPage, limit);
            }
        } catch (err) {
            setError('Failed to delete todo. Please try again.');
            console.error(err);
        }
    };

    const handlePageChange = (newPage) => {
        console.log(`Changing page from ${currentPage} to ${newPage}`);
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading && todos.length === 0) {
        return <div className="text-center py-10">Loading todos...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Todo list with fixed height and scrollable content */}
                <div className="h-[calc(100vh-150px)] min-h-[200px] overflow-y-auto mb-4">
                    <TodoList
                        todos={todos}
                        selectedTodo={selectedTodo}
                        onSelectTodo={handleSelectTodo}
                    />
                </div>

                {/* Debug information - outside scrollable area */}
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                    <p>Debug: Current Page: {currentPage}, Total Pages: {totalPages}, Items per page: {limit}</p>
                    <p>Total Todos: {todos.length} (on this page)</p>
                </div>

                {/* Pagination Controls - outside scrollable area */}
                <div className="flex justify-center items-center mt-2 space-x-2 py-2">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        First
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        Prev
                    </button>
                    <span className="px-3 py-1">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        Next
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        Last
                    </button>
                </div>
            </div>

            <div className="flex  flex-col">
                <div className="flex-grow">
                    <TodoForm
                        key={formKey}
                        todo={selectedTodo}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>

                {selectedTodo && (
                    <div className="absolute bottom-5 text-right">
                        <button
                            type="button"
                            onClick={() => handleDelete(selectedTodo._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Delete Todo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoListClient; 