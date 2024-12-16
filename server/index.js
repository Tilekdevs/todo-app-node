require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const connectionDB = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const todoModal = require("./models/todo");

const connectionString = process.env.DB;

mongoose.set('strictQuery', false);

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((error) => {
    console.error("Could not connect to database!", error);
  });

app.use(express.json());
app.use(cors());


const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
};

app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);


app.get('/get', (req, res) => {
  todoModal
    .find()
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/add', (req, res) => {
  const { task, category = 'Общие' } = req.body; 
  todoModal
    .create({ task, category, done: false, createdAt: new Date() })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});


app.post('/create', (req, res) => {
  const { task, category } = req.body;

  const newTask = new todoModal({ task, category, done: false, createdAt: new Date() });
  newTask.save()
    .then(savedTask => res.json(savedTask))
    .catch(err => res.status(500).json({ error: 'Ошибка при создании задачи' }));
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;

  todoModal
    .findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).json({ error: "Task not found" });
      }

      return todoModal.findByIdAndUpdate(
        id,
        { done: !todo.done },
        { new: true }
      );
    })
    .then(updatedTodo => res.json(updatedTodo))
    .catch(err => {
      console.error('Error updating task:', err);
      res.status(500).json({ error: 'Server error' });
    });
});


app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  todoModal
    .findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully', result });
    })
    .catch((err) => {
      console.error('Error deleting task:', err);
      res.status(500).json({ error: 'Server error' });
    });
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
