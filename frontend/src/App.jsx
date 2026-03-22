import { useEffect, useState } from 'react';
import axios from 'axios';

// 이미지 import
import bgImage from './assets/bg.png';
import logoImage from './assets/mark.png';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // 🔥 ✅ 여기만 수정됨
  const API = import.meta.env.PROD
    ? '/api/todos'
    : import.meta.env.VITE_API_URL + '/api/todos';

  // 전체 조회
  const fetchTodos = async () => {
    const res = await axios.get(API);
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 추가
  const addTodo = async () => {
    if (!text.trim()) return;

    await axios.post(API, { text });
    setText('');
    fetchTodos();
  };

  // 삭제
  const deleteTodo = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTodos();
  };

  // 완료 토글
  const toggleTodo = async (todo) => {
    await axios.put(`${API}/${todo._id}`, {
      text: todo.text,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* 로고 */}
        <img src={logoImage} alt="logo" style={styles.logo} />

        <h1 style={styles.title}>Todo App</h1>

        {/* 입력창 */}
        <div style={styles.inputBox}>
          <input
            style={styles.input}
            placeholder="할 일을 입력하세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button style={styles.addBtn} onClick={addTodo}>
            추가
          </button>
        </div>

        {/* 리스트 */}
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo._id} style={styles.item}>

              <div style={styles.leftSection}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />
                <span
                  style={{
                    ...styles.text,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#999' : '#000',
                  }}
                >
                  {todo.text}
                </span>
              </div>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteTodo(todo._id)}
              >
                삭제
              </button>

            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;

const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    background: 'rgba(255,255,255,0.9)',
    padding: '30px',
    borderRadius: '20px',
    width: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(5px)',
  },

  logo: {
    width: '80px',
    display: 'block',
    margin: '0 auto 10px',
  },

  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },

  inputBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },

  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ddd',
  },

  addBtn: {
    padding: '10px 15px',
    borderRadius: '10px',
    border: 'none',
    background: '#1e3a8a',
    color: '#fff',
    cursor: 'pointer',
  },

  list: {
    listStyle: 'none',
    padding: 0,
  },

  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f7f7f7',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
    transition: 'all 0.3s ease',
  },

  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  text: {
    fontSize: '16px',
  },

  deleteBtn: {
    background: '#ff4d4f',
    border: 'none',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};