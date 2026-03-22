import mongoose from 'mongoose';
import Todo from '../backend/models/Todo.js'; // 경로 수정 필요

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('✅ MongoDB 연결 성공');
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const todos = await Todo.find();
    return res.status(200).json(todos);
  }

  if (req.method === 'POST') {
    const todo = await Todo.create({ text: req.body.text });
    return res.status(200).json(todo);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const updated = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await Todo.findByIdAndDelete(id);
    return res.status(200).json({ message: '삭제 완료' });
  }

  res.status(405).end();
}