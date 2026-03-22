// api/todos.js

let todos = [];

export default function handler(req, res) {
  const { method, query } = req;

  // GET
  if (method === 'GET') {
    return res.status(200).json(todos);
  }

  // POST
  if (method === 'POST') {
    const newTodo = {
      _id: Date.now().toString(),
      text: req.body.text,
      completed: false,
    };
    todos.push(newTodo);
    return res.status(200).json(newTodo);
  }

  // PUT
  if (method === 'PUT') {
    const { id } = query;

    todos = todos.map(todo =>
      todo._id === id ? { ...todo, ...req.body } : todo
    );

    return res.status(200).json({ message: 'updated' });
  }

  // DELETE
  if (method === 'DELETE') {
    const { id } = query;

    todos = todos.filter(todo => todo._id !== id);

    return res.status(200).json({ message: 'deleted' });
  }

  return res.status(405).end();
}