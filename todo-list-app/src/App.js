import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    // APIからTODOリストアイテムを取得する
    axios.get('http://localhost:3001/api/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const addTodo = () => {
    // 新しいTODOリストアイテムを作成する
    axios.post('http://localhost:3001/api/todos', { task: newTodo })
      .then(response => {
        // 作成したTODOリストアイテムをリストに追加する
        const newTodos = [...todos, { id: response.data.id, task: newTodo, completed: false }];
        setTodos(newTodos);
        setNewTodo('');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteTodo = (id) => {
    // TODOリストアイテムを削除する
    axios.delete(`http://localhost:3001/api/todos/${id}`)
      .then(response => {
        // 削除されたTODOリストアイテムをリストから除外する
        const newTodos = todos.filter(todo => todo.id !== id);
        setTodos(newTodos);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const toggleTodo = (id, completed) => {
    // TODOリストアイテムを更新する
    axios.put(`http://localhost:3001/api/todos/${id}`, { completed: !completed })
      .then(response => {
        // 更新されたTODOリストアイテムをリストに反映する
        const newTodos = todos.map(todo => {
          if (todo.id === id) {
            return { ...todo, completed: !completed };
          } else {
            return todo;
          }
        });
        setTodos(newTodos);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>TODOリスト</h1>
      <div>
        <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
        <button onClick={addTodo}>追加</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id, todo.completed)} />
            {todo.task}
            <button onClick={() => deleteTodo(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
