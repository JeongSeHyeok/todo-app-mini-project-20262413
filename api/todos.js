import mongoose from "mongoose";

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI);

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const todos = await Todo.find();
      return res.status(200).json(todos);
    }

    if (method === "POST") {
      const todo = new Todo({ text: req.body.text });
      await todo.save();
      return res.status(201).json(todo);
    }

    if (method === "PUT") {
      const { id } = req.query;
      const updated = await Todo.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      return res.status(200).json(updated);
    }

    if (method === "DELETE") {
      const { id } = req.query;
      await Todo.findByIdAndDelete(id);
      return res.status(200).json({ message: "삭제 완료" });
    }

    return res.status(405).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}