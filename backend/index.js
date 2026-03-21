require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Todo = require('./models/Todo');

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 테스트
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 🔥 핵심: /api 유지 (다시 원래대로!)
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
    });

    const savedTodo = await todo.save();
    res.json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
        completed: req.body.completed,
      },
      { new: true }
    );

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥🔥🔥 가장 중요 부분 🔥🔥🔥

// 👉 항상 실행 (로컬용)
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 로컬 서버 실행: http://localhost:${PORT}`);
});

// 👉 Vercel용
module.exports = app;