import { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

function Create({ onTaskAdd }) {
  const [task, setTask] = useState('');

  const handleAdd = () => {
    if (task.trim() === '') return;

    axios
      .post('http://localhost:8080/add', { task })
      .then(result => {
        onTaskAdd(result.data); 
        setTask('');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className={styles.create_form}>
      <input
        type='text'
        placeholder='Enter task'
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={handleAdd} type='button'>
        Добавить
      </button>
    </div>
  );
}

export default Create;
