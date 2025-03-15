# Todo App

A full-stack Todo application built with Next.js, Express, MongoDB, and Tailwind CSS.

## Features

- Create, read, update, and delete todos
- Rich text editor for todo descriptions
- Responsive design with Tailwind CSS
- Server-side rendering with Next.js
- RESTful API with Express
- MongoDB database for data persistence

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todo-app
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the development server:

```bash
# Run both Next.js and Express servers concurrently
npm run dev:all

# Or run them separately
npm run dev        # Next.js frontend
npm run dev:server # Express backend
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app` - Next.js frontend
  - `/components` - React components
  - `/utils` - Utility functions
- `/server` - Express backend
  - `/models` - MongoDB models
  - `/routes` - API routes

## Deployment

1. Build the Next.js application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## License

MIT
