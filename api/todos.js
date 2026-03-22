const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
}

// 모델 정의
const TodoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

// handler
module.exports = async (req, res) => {
  try {
    await connectDB(); // ✅ 여기서 연결

    if (req.method === 'GET') {
      const todos = await Todo.find();
      return res.status(200).json(todos);
    }

    if (req.method === 'POST') {
      const todo = new Todo({ text: req.body.text });
      const saved = await todo.save();
      return res.status(200).json(saved);
    }

    if (req.method === 'PUT') {
      const { id, text, completed } = req.body;
      const updated = await Todo.findByIdAndUpdate(
        id,
        { text, completed },
        { new: true }
      );
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await Todo.findByIdAndDelete(id);
      return res.status(200).json({ message: '삭제 완료' });
    }

    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};