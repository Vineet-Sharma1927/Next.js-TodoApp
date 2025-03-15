'use client';

import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from './RichTextEditor';
import { updateTodo } from '../utils/api';

const TodoForm = ({ todo, onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [key, setKey] = useState(Date.now()); // Add a key to force re-render of RichTextEditor
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // Use a debounce timer for auto-saving
    const autoSaveTimerRef = useRef(null);
    const initialLoadRef = useRef(false);

    useEffect(() => {
        // Reset form fields when todo changes
        if (todo) {
            setTitle(todo.title || '');
            setDescription(todo.description || '');
            setCompleted(todo.completed || false);
            setIsEditing(true);
            initialLoadRef.current = true;
        } else {
            setTitle('');
            setDescription('');
            setCompleted(false);
            setIsEditing(false);
            initialLoadRef.current = false;
        }
        // Generate a new key to force re-render of RichTextEditor
        setKey(Date.now());

        // Clear any pending auto-save
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        setSaveStatus('');
    }, [todo]);

    // Auto-save when content changes (if editing an existing todo)
    useEffect(() => {
        // Only auto-save if we're editing an existing todo and it's not the initial load
        if (isEditing && todo && initialLoadRef.current && title.trim()) {
            // Clear any existing timer
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }

            setSaveStatus('Saving...');

            // Set a new timer for auto-save
            autoSaveTimerRef.current = setTimeout(async () => {
                try {
                    setIsSaving(true);

                    // Ensure description is at least an empty string, not null or undefined
                    const sanitizedDescription = description || '';

                    // Update the todo in the database
                    await updateTodo(todo._id, {
                        title,
                        description: sanitizedDescription,
                        completed
                    });

                    setSaveStatus('Saved');

                    // Clear the save status after 2 seconds
                    setTimeout(() => {
                        setSaveStatus('');
                    }, 2000);
                } catch (err) {
                    console.error('Auto-save failed:', err);
                    setSaveStatus('Save failed');
                } finally {
                    setIsSaving(false);
                }
            }, 1000); // 1 second debounce
        }

        // After the first change, set initialLoadRef to false so auto-save will work
        if (initialLoadRef.current) {
            initialLoadRef.current = false;
        }

        // Cleanup the timer when component unmounts
        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [title, description, completed, isEditing, todo]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        // Ensure description is at least an empty string, not null or undefined
        const sanitizedDescription = description || '';

        onSubmit({
            ...(todo && { _id: todo._id }),
            title,
            description: sanitizedDescription,
            completed
        });

        // Clear form after submission
        setTitle('');
        setDescription('');
        setCompleted(false);
        setKey(Date.now()); // Force re-render of RichTextEditor
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex flex-col">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">
                    {isEditing ? 'Edit Todo' : 'Add New Todo'}
                </h2>
                {saveStatus && (
                    <span className={`text-sm ${saveStatus === 'Saved' ? 'text-green-500' : saveStatus === 'Save failed' ? 'text-red-500' : 'text-gray-500'}`}>
                        {saveStatus}
                    </span>
                )}
            </div>

            <div className="mb-3">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter todo title"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (optional)
                </label>
                <RichTextEditor
                    key={key} // Add key to force re-render when todo changes
                    content={description}
                    onChange={setDescription}
                />
            </div>

            <div className="mb-3">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Mark as completed</span>
                </label>
            </div>

            <div className="flex justify-end space-x-2 mt-2 sticky bottom-0">
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            onCancel();
                            setKey(Date.now()); // Force re-render of RichTextEditor when canceling
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                    {isEditing ? 'Update' : 'Add Todo'}
                </button>
            </div>
        </form>
    );
};

export default TodoForm; 