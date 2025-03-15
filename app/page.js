import Image from 'next/image';
import Navbar from './components/Navbar';
import TodoListClient from './components/TodoListClient';

export const metadata = {
  title: 'Todo App',
  description: 'A Next.js Todo application with Express backend and MongoDB',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <TodoListClient />
        </div>
      </main>
    </div>
  );
}
