import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from 'react-icons/md';
import Create from './CreateTodo.jsx';
import styles from './styles.module.css';

const Main = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

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

  const handleTaskAdd = (newTask, category) => {
    axios
      .post('http://localhost:8080/add', { task: newTask, category })
      .then(response => {
        setTodos(prevTodos => [response.data, ...prevTodos]);
      })
      .catch(err => {
        setError('Ошибка при добавлении задачи');
        console.log(err);
      });
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

  const formatDate = date => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFilterChange = filterValue => {
    setFilter(filterValue);
  };

  const handleCategoryFilterChange = category => {
    setCategoryFilter(category);
  };

  const getFilteredTodos = () => {
    let filteredTodos = [...todos];

    if (categoryFilter !== 'all') {
      filteredTodos = filteredTodos.filter(todo => todo.category === categoryFilter);
    }

    switch (filter) {
      case 'done':
        filteredTodos = filteredTodos.filter(todo => todo.done);
        break;
      case 'not_done':
        filteredTodos = filteredTodos.filter(todo => !todo.done);
        break;
      case 'date_asc':
        filteredTodos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'date_desc':
        filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return filteredTodos;
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'General':
        return 'Общие';
      case 'Work':
        return 'Работа';
      case 'Personal':
        return 'Личное';
      case 'Other':
        return 'Другое';
      default:
        return category; // Если категория не найдена, выводим саму категорию
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>ToDo-App</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <Create onTaskAdd={handleTaskAdd} />

      <div className={styles.filter_container}>
        <label className={styles.filter_label} htmlFor="categoryFilter">
          Категория:
        </label>
        <select
          id="categoryFilter"
          className={styles.filter_dropdown}
          onChange={e => handleCategoryFilterChange(e.target.value)}
        >
          <option value="all">Все</option>
          <option value="General">Общие</option>
          <option value="Work">Работа</option>
          <option value="Personal">Личное</option>
          <option value="Other">Другое</option>
        </select>

        <label className={styles.filter_label} htmlFor="filter">
          Сортировать:
        </label>
        <select
          id="filter"
          className={styles.filter_dropdown}
          onChange={e => handleFilterChange(e.target.value)}
        >
          <option value="all">Все</option>
          <option value="done">Выполненные</option>
          <option value="not_done">Невыполненные</option>
          <option value="date_asc">По дате (сначала старые)</option>
          <option value="date_desc">По дате (сначала новые)</option>
        </select>
      </div>

      <div className={styles.mainTodo}>
        <div className={styles.container}>
          {loading ? (
            <h2>Загрузка...</h2>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : filteredTodos.length === 0 ? (
            <h1>Нет задач</h1>
          ) : (
            filteredTodos.map(todo => (
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
                  <p
                    className={todo.done ? styles.task_text : styles.task_text_done}
                  >
                    {todo.task}
                  </p>
                </div>
                <p className={styles.task_category}>
                  Категория: {getCategoryName(todo.category)}
                </p>
                <p className={styles.task_date}>
                  Создано: {formatDate(todo.createdAt)}
                </p>
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
