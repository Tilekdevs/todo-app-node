require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const connectionDB = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const todoModal = require("./models/todo");

const connectionString = process.env.DB;

mongoose.set('strictQuery', false); // это отключит предупреждение

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((error) => {
    console.error("Could not connect to database!", error);
  });

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
};

app.use(cors(corsOptions));

app.get('/get', (req, res) => {
  todoModal
    .find()
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

app.post('/add', (req, res) => {
  const task = req.body.task;
  todoModal
    .create({ task: task })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  todoModal
    .findByIdAndUpdate({ _id: id }, { done: true })
    .then(result => res.json(result))
    .catch(err => res.json(err));
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
