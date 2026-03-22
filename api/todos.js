const mongoose = require('mongoose');

// ✅ MongoDB 연결 (여기에 넣어야 함)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 모델 정의
const TodoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

// handler
module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const todos = await Todo.find();
      return res.json(todos);
    }

    if (req.method === 'POST') {
      const todo = new Todo({ text: req.body.text });
      const saved = await todo.save();
      return res.json(saved);
    }

    if (req.method === 'PUT') {
      const { id, text, completed } = req.body;
      const updated = await Todo.findByIdAndUpdate(
        id,
        { text, completed },
        { new: true }
      );
      return res.json(updated);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await Todo.findByIdAndDelete(id);
      return res.json({ message: '삭제 완료' });
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};