import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://next-js-todoapp-backend.onrender.com/api/todos';

export const fetchTodos = async (page = 1, limit = 8) => {
  try {
    console.log(`Fetching todos with page=${page}, limit=${limit}`);
    
    const response = await axios.get(`${API_URL}/todos`, {
      params: { page, limit }
    });
    
    console.log('API response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const fetchTodoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching todo ${id}:`, error);
    throw error;
  }
};

export const createTodo = async (todoData) => {
  try {
    const response = await axios.post(`${API_URL}/todos`, todoData);
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

export const updateTodo = async (id, todoData) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${id}`, todoData);
    return response.data;
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error);
    throw error;
  }
}; 