import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    try {
      const parsed = JSON.parse(storedTodos);
      if (Array.isArray(parsed)) {
        setTodos(parsed);
      }
    } catch (e) {
      console.error('Failed to parse todos from localStorage', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (todo.trim() === '') return;
    const now = new Date();
    const newTodo = {
      id: now.getTime(),
      text: todo,
      time: now.toLocaleString(),
      timestamp: now.getTime(),
      pinned: false,
      completed: false,
      isEditing: false
    };
    setTodos([...todos, newTodo]);
    setTodo('');
  };

  const handleDelete = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const switchPinStatus = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, pinned: !todo.pinned } : todo
    );
    setTodos(newTodos);
  };

  const markAsDone = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  const enableEditing = (id) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    setTodos(updated);
  };

  const handleEditChange = (id, newText) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos(updated);
  };

  const handleClearAll = () => {
    setTodos([]);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pinned') return todo.pinned;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (b.pinned !== a.pinned) {
      return b.pinned - a.pinned;
    }
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="container">
      <h1>Todo List</h1>

      <form onSubmit={handleAdd} className="form">
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Add a task"
          className="input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      <div className="controls">
        <select onChange={(e) => setFilter(e.target.value)} className="filter">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pinned">Pinned</option>
        </select>
        <button onClick={handleClearAll} className="clear-button">🧹 Clear All</button>
      </div>

      {sortedTodos.length === 0 ? (
        <p className="empty-state">No tasks to show. Add something above! ✨</p>
      ) : (
        <ul className="list">
          {sortedTodos.map((item) => (
            <li key={item.id} className="list-item">
              <div>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => markAsDone(item.id)}
                />
                {item.isEditing ? (
                  <input
                    value={item.text}
                    onChange={(e) => handleEditChange(item.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        enableEditing(item.id);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span className={item.completed ? 'completed-text' : ''}>
                    {item.text}
                  </span>
                )}
                <div className="timestamp">
                  <small style={{ color: '#888' }}>Added at: {item.time}</small>
                </div>
              </div>
              <div className="buttons">
                <button onClick={() => enableEditing(item.id)} className="edit-button">
                  ✏️ {item.isEditing ? 'Save' : 'Edit'}
                </button>
                <button onClick={() => switchPinStatus(item.id)} className="pin-button">
                  {item.pinned ? '📌 Unpin' : '📍 Pin'}
                </button>
                <button onClick={() => handleDelete(item.id)} className="delete-button">
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
