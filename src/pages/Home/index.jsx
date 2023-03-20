import './styles.css'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Task from '../../components/Task'
import DeleteModal from '../../components/DeleteModal';
import { VscAdd } from "react-icons/vsc";

const Home = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');

  const toggleModal = () => {
    setModal(!modal)
  }

  // if (modal) {
  //   document.body.classList.add('active-modal')
  // } else {
  //   document.body.classList.remove('active-modal')
  // }

  const setTaskToDelete = (taskId) => {
    setModal(!modal);
    setIdToDelete(taskId);
  }

  const validateInput = (value) => {
    return !!value;
  }

  const handleInputChange = (event) => {
    setTask(event.target.value);
  }

  const handleAddTask = () => {
    const isValid = validateInput(task);
    if (!isValid) {
      alert('You must type anything');
      return;
    }
    setTasks(prevState => {
      return [...prevState, {
        id: uuidv4(),
        description: task,
        checked: false
      }]
    });
    setTask('');
  }

  const handleDeleteTask = (taskId) => {
    toggleModal()
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  }

  const handleCheckTask = (taskId) => {
    const newTasks = tasks.map((task) => task.id === taskId ? { ...task, checked: !task.checked } : task)
    setTasks(newTasks);
  }

  const handleDeleteAll = () => {
    const newTasks = tasks.filter((task) => !task.checked);
    if (newTasks.length === tasks.length) {
      alert('There is no task checked');
    }
    setTasks(newTasks);
  }

  const handleCheckAll = () => {
    const newTasks = tasks.map((task) => ({
      ...task,
      checked: true
    }))
    setTasks(newTasks);
  }

  return (
    <div className="container">
      <header>
        <h1 className="messages">Welcome back, Marcao</h1>
        <p className="messages">You've got {tasks.length} tasks coming up in the next days.</p>
      </header>
      <div className="handle-task-container">
        <input className="add-task-input messages" type="text" placeholder="Add new task..." value={task} onChange={handleInputChange}></input>
        <button className="add-task-button" onClick={handleAddTask}><VscAdd /></button>
      </div>
      {modal && <DeleteModal
        toggleModal={toggleModal}
        deleteAction={handleDeleteTask}
        taskToDelete={idToDelete}
      />}
      <ul className="tasks-container">
        {tasks.length > 0 ?
          tasks.map((task) => <Task key={task.id}
            taskId={task.id}
            description={task.description}
            checked={task.checked}
            handleCheckTask={handleCheckTask}
            setTaskToDelete={setTaskToDelete} />)
          : <p className="no-tasks messages">There are no tasks</p>}
      </ul>
      <div className="check-buttons-container">
        <div className="check-buttons">
          {tasks.length ? <button className="delete-all-tasks-button" onClick={handleCheckAll}>Check all</button> : null}
          {tasks.length ? <button className="delete-all-tasks-button" onClick={handleDeleteAll}>Delete all checked</button> : null}
        </div>
      </div>

    </div>
  )
}

export default Home;