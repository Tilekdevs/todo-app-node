import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from 'react-icons/md';
import Create from './CreateTodo.jsx';
import styles from './styles.module.css';

const Main = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/get')
      .then(result => {
        setTodos(result.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Ошибка при загрузке задач');
        setLoading(false);
      });
  }, []);

  const handleTaskAdd = newTask => {
    setTodos(prevTodos => [newTask, ...prevTodos]);
  };

  const handleEdit = id => {
    axios
      .put('http://localhost:8080/update/' + id)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo._id === id ? { ...todo, done: !todo.done } : todo
          )
        );
      })
      .catch(err => {
        setError('Ошибка при обновлении задачи');
        console.log(err);
      });
  };

  const handleDelete = id => {
    axios
      .delete('http://localhost:8080/delete/' + id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
      })
      .catch(err => {
        setError('Ошибка при удалении задачи');
        console.log(err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>ToDo-App</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <Create onTaskAdd={handleTaskAdd} />
      <div className={styles.mainTodo}>
        <div className={styles.container}>
          {loading ? (
            <h2>Загрузка...</h2>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : todos.length === 0 ? (
            <h1>Нет задач</h1>
          ) : (
            todos.map(todo => (
              <div className={styles.task} key={todo._id}>
                <div
                  className={styles.checkbox}
                  onClick={() => handleEdit(todo._id)}
                >
                  {todo.done ? (
                    <MdOutlineCheckBox className={styles.checkbox_icon} />
                  ) : (
                    <MdCheckBoxOutlineBlank className={styles.checkbox_icon} />
                  )}
                  <p className={todo.done ? styles.task_text : styles.task_text_done}>
                    {todo.task}
                  </p>
                </div>
                <div>
                  <FaRegTrashCan
                    className={styles.trash_icon}
                    onClick={() => handleDelete(todo._id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
