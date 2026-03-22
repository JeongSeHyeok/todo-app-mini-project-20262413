import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const todos = await Todo.find();
    return res.status(200).json(todos);
  }

  if (req.method === "POST") {
    const newTodo = new Todo({
      text: req.body.text,
      completed: false,
    });
    await newTodo.save();
    return res.status(201).json(newTodo);
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const updated = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await Todo.findByIdAndDelete(id);
    return res.status(200).json({ message: "삭제 완료" });
  }

  res.status(405).end();
}