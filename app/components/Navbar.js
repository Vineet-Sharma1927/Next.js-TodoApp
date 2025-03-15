import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 py-4 px-6 w-full">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ✓ TodoApp
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 