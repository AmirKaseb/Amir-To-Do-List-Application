import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Loader2, Moon, Star, Calendar } from 'lucide-react';

// Define the Todo item type
interface Todo {
  id: string;
  name: string;
  description: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'https://hp6uv0z2le.execute-api.eu-west-3.amazonaws.com/dev/items';

  // Fetch all todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      
      // Extract the items array from the response
      const items = data.items || [];
      setTodos(items);
    } catch (err) {
      setError('Error fetching todos. Please try again.');
      console.error(err);
      // Set empty array on error to prevent mapping issues
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoName.trim()) return;

    setIsSubmitting(true);
    setError(null);
    
    const newTodo = {
      id: Date.now().toString(),
      name: newTodoName,
      description: newTodoDescription
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      // Refresh the todo list
      await fetchTodos();
      
      // Clear the form
      setNewTodoName('');
      setNewTodoDescription('');
    } catch (err) {
      setError('Error adding todo. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      // Update the local state
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Error deleting todo. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 py-8 font-sans">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-yellow-300 opacity-20">
          <Star size={40} />
        </div>
        <div className="absolute top-20 right-20 text-yellow-300 opacity-20">
          <Moon size={60} />
        </div>
        <div className="absolute bottom-10 left-20 text-yellow-300 opacity-20">
          <Star size={50} />
        </div>
        <div className="absolute bottom-20 right-10 text-yellow-300 opacity-20">
          <Moon size={40} />
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <div className="bg-white bg-opacity-95 rounded-lg shadow-xl overflow-hidden border-t-4 border-yellow-500">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-6 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <div className="flex justify-center items-center mb-2">
              <Moon className="text-yellow-400 mr-2" size={28} />
              <Calendar className="text-yellow-400 ml-2" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-white">Ramadan Mubarak</h1>
            <p className="text-yellow-300 mt-1">Amir's Blessed To-Do List</p>
            
            {/* Decorative pattern */}
            <div className="flex justify-center mt-4">
              <div className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
            </div>
          </div>
          
          {/* Add Todo Form */}
          <form onSubmit={addTodo} className="p-6 border-b border-indigo-100">
            <div className="mb-4">
              <label htmlFor="todoName" className="block text-sm font-medium text-indigo-800 mb-1">
                Task Name
              </label>
              <input
                type="text"
                id="todoName"
                value={newTodoName}
                onChange={(e) => setNewTodoName(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                placeholder="What needs to be done?"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="todoDescription" className="block text-sm font-medium text-indigo-800 mb-1">
                Description (optional)
              </label>
              <textarea
                id="todoDescription"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                placeholder="Add details about this task..."
                rows={3}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !newTodoName.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-3 px-4 rounded-md hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Blessed Task
                </>
              )}
            </button>
          </form>
          
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {/* Todo List */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-indigo-700" />
              Your Ramadan Tasks
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-indigo-50 rounded-lg p-6">
                  <Moon className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                  <p className="text-indigo-600">No tasks yet. Add one above to begin your blessed journey!</p>
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {todos.map((todo) => (
                  <li key={todo.id} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-indigo-900">{todo.name}</h3>
                        {todo.description && (
                          <p className="mt-1 text-indigo-600">{todo.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none bg-white rounded-full p-2 hover:bg-red-50 transition-colors duration-200"
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 text-center">
            <p className="text-indigo-700 text-sm">May your Ramadan be filled with blessings and productivity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;