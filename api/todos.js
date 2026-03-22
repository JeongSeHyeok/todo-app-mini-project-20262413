import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
};

// 모델
const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

export default async function handler(req, res) {
  await connectDB();

  try {
    if (req.method === "GET") {
      const todos = await Todo.find();
      return res.status(200).json(todos);
    }

    if (req.method === "POST") {
      const todo = await Todo.create({
        text: req.body.text,
        completed: false,
      });
      return res.status(201).json(todo);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      await Todo.findByIdAndDelete(id);
      return res.status(200).json({ message: "삭제됨" });
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const updated = await Todo.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json(updated);
    }

    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}