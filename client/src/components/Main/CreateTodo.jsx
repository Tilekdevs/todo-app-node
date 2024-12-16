import { useState } from 'react';
import style from './styles.module.css'

const CreateTodo = ({ onTaskAdd }) => {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('Общие'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      onTaskAdd(task, category); 
      setTask('');
      setCategory('Общие'); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.create_form}>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Добавьте задачу"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)} 
      >
        <option value="Общие">Общие</option>
        <option value="Работа">Работа</option>
        <option value="Личное">Личное</option>
        <option value="Другое">Другое</option>
      </select>
      <button type="submit">Добавить</button>
    </form>
  );
};

export default CreateTodo;
