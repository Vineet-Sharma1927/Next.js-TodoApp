'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaHighlighter } from 'react-icons/fa';
import { MdFormatColorText } from 'react-icons/md';
import { CustomColor } from './extensions/CustomColor';
import { CustomHighlight } from './extensions/CustomHighlight';

const RichTextEditor = ({ content, onChange }) => {
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      CustomColor,
      CustomHighlight,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none w-full max-w-none dark:prose-invert',
      },
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.color-dropdown') && !e.target.closest('.highlight-dropdown')) {
        setShowColorMenu(false);
        setShowHighlightMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (!editor) {
    return null;
  }

  const handleButtonClick = (e, callback) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    callback();
  };

  const toggleDropdown = (e, dropdown) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropdown === 'color') {
      setShowColorMenu(!showColorMenu);
      setShowHighlightMenu(false);
    } else if (dropdown === 'highlight') {
      setShowHighlightMenu(!showHighlightMenu);
      setShowColorMenu(false);
    }
  };

  const colors = [
    { label: 'Default', value: 'inherit' },
    { label: 'Black', value: '#000000' },
    { label: 'Red', value: '#ff0000' },
    { label: 'Green', value: '#00ff00' },
    { label: 'Blue', value: '#0000ff' },
    { label: 'Yellow', value: '#ffff00' },
    { label: 'Purple', value: '#800080' },
  ];

  const highlightColors = [
    { label: 'Yellow', value: '#ffff00' },
    { label: 'Green', value: '#00ff00' },
    { label: 'Pink', value: '#ff00ff' },
    { label: 'Blue', value: '#00ffff' },
    { label: 'Red', value: '#ff9999' },
  ];

  return (
    <div className="rich-text-editor border rounded-md overflow-hidden">
      <div className="flex flex-wrap bg-gray-100 dark:bg-gray-800 p-2 border-b">
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBold().run())}
          className={`p-1 rounded mr-1 mb-1 ${editor.isActive('bold') ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
          title="Bold"
        >
          <FaBold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())}
          className={`p-1 rounded mr-1 mb-1 ${editor.isActive('italic') ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
          title="Italic"
        >
          <FaItalic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleUnderline().run())}
          className={`p-1 rounded mr-1 mb-1 ${editor.isActive('underline') ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
          title="Underline"
        >
          <FaUnderline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBulletList().run())}
          className={`p-1 rounded mr-1 mb-1 ${editor.isActive('bulletList') ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
          title="Bullet List"
        >
          <FaListUl className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleOrderedList().run())}
          className={`p-1 rounded mr-1 mb-1 ${editor.isActive('orderedList') ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
          title="Numbered List"
        >
          <FaListOl className="w-4 h-4" />
        </button>

        {/* Text Color Dropdown */}
        <div className="relative inline-block mr-1 mb-1 color-dropdown">
          <button
            type="button"
            onClick={(e) => toggleDropdown(e, 'color')}
            className={`p-1 rounded flex items-center ${showColorMenu ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
            title="Text Color"
          >
            <MdFormatColorText className="w-4 h-4" />
          </button>
          {showColorMenu && (
            <div 
              className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg p-1 mt-1 w-24"
            >
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (color.value === 'inherit') {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(color.value).run();
                    }
                    setShowColorMenu(false);
                  }}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  style={{ color: color.value !== 'inherit' ? color.value : 'currentColor' }}
                >
                  {color.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Highlight Dropdown */}
        <div className="relative inline-block mr-1 mb-1 highlight-dropdown">
          <button
            type="button"
            onClick={(e) => toggleDropdown(e, 'highlight')}
            className={`p-1 rounded flex items-center ${showHighlightMenu ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
            title="Highlight"
          >
            <FaHighlighter className="w-4 h-4" />
          </button>
          {showHighlightMenu && (
            <div 
              className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg p-1 mt-1 w-24"
            >
              {highlightColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    editor.chain().focus().setHighlight(color.value).run();
                    setShowHighlightMenu(false);
                  }}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                  <span className="inline-block w-full py-1" style={{ backgroundColor: color.value }}>
                    {color.label}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightMenu(false);
                }}
                className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-3 min-h-[120px] max-h-[200px] overflow-y-auto bg-white dark:bg-gray-700 text-black dark:text-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;