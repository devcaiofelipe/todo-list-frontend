import './styles.css'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Task from '../../components/Task'
import DeleteModal from '../../components/DeleteModal';
import UpdateModal from '../../components/UpdateModal';
import { VscAdd } from "react-icons/vsc";

const Home = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([
    {
      id: uuidv4(),
      description: 'Estudar javascript',
      checked: false,
      done: false,
    },
    {
      id: uuidv4(),
      description: 'Estudar python',
      checked: false,
      done: false,
    },
    {
      id: uuidv4(),
      description: 'Estudar swift',
      checked: false,
      done: false,
    }
  ]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [someChecked, setSomeChecked] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [oldValue, setOldValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal)
  }

  const toggleUpdateModal = () => {
    setUpdateModal(!updateModal)
  }

  const handleFilter = (e) => {
    if (e.target.value === 'done') {
      const tasksFiltered = tasks.filter(task => task.done)
      setFilteredTasks(tasksFiltered);
    } else if (e.target.value === 'in-progress') {
      const tasksFiltered = tasks.filter(task => !task.done)
      setFilteredTasks(tasksFiltered);
    } else {
      setFilteredTasks(tasks);
    }
  }

  const handleTaskToDelete = (taskId) => {
    setDeleteModal(!deleteModal);
    setIdToDelete(taskId);
  }

  const handleTaskIdToUpdate = (taskId) => {
    const oldValue = tasks.filter((task) => task.id === taskId)[0];
    setOldValue(oldValue.description);
    setUpdateModal(!updateModal);
    setIdToUpdate(taskId);
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
        checked: false,
        done: false,
      }]
    });
    setTask('');
    setFilteredTasks(prevState => {
      return [
        ...prevState, {
          id: uuidv4(),
          description: task,
          checked: false,
          done: false,
        }
      ]
    })
  }

  const handleDeleteTask = (taskId) => {
    toggleDeleteModal()
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  }

  const handleCheckTask = (taskId) => {
    if (!someChecked) {
      setSomeChecked(true);
    } else {
      setSomeChecked(false);
    }
    const newTasks = tasks.map((task) => task.id === taskId ? { ...task, checked: !task.checked } : task)
    setTasks(newTasks);
    setFilteredTasks(newTasks);
  }

  const handleDeleteAll = () => {
    const newTasks = tasks.filter((task) => !task.checked);
    if (newTasks.length === tasks.length) {
      alert('There is no task checked');
    }
    setTasks(newTasks);
  }

  const handleCheckAll = () => {
    if (!someChecked) {
      const newTasks = tasks.map((task) => ({
        ...task,
        checked: true
      }))
      setTasks(newTasks);
      setFilteredTasks(newTasks);
      setSomeChecked(true);
    } else {
      const newTasks = tasks.map((task) => ({
        ...task,
        checked: false
      }))
      setTasks(newTasks);
      setFilteredTasks(newTasks);
      setSomeChecked(false);
    }
    
  }

  const handleKeyPressed = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  }
  
  const handleUpdateTask = (taskId, newDescription) => {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          description: newDescription
        }
      } else {
        return task;
      } 
    })
    setTasks(newTasks);
    toggleUpdateModal()
  }

  const handleDoneTask = (taskId) => {
    const newTasks = tasks.map((task) => taskId === task.id ? { ...task, done: !task.done } : task );
    setTasks(newTasks);
    setFilteredTasks(newTasks);
  }

  return (
    <div className="container">
      <header>
        <h1 className="messages">Welcome back, Caio</h1>
        <p className="messages">You've got {tasks.length} tasks coming up in the next days.</p>
      </header>

      <div className="handle-task-container">
        <input className="add-task-input messages" type="text" placeholder="Add new task..." autoFocus value={task} onChange={handleInputChange} onKeyDown={handleKeyPressed}></input>
        <button className="add-task-button" onClick={handleAddTask}><VscAdd /></button>
      </div>

      <div className="status-container">
        <select className="status-select" defaultValue={filter} onChange={handleFilter}>
          <option className="status-option" value="all">All</option>
          <option className="status-option" value="done">Done</option>
          <option className="status-option" value="in-progress">In Progress</option>
        </select>
      </div>
      

      {deleteModal && <DeleteModal
        toggleModal={toggleDeleteModal}
        deleteAction={handleDeleteTask}
        taskToDelete={idToDelete}
      />}

      {updateModal && <UpdateModal
        toggleModal={toggleUpdateModal}
        idToUpdate={idToUpdate}
        oldValue={oldValue}
        handleUpdateTask={handleUpdateTask}
      />}

      <ul className="tasks-container">
        {filteredTasks.length > 0 ?
          filteredTasks.map((task) => <Task key={task.id}
            task={task}
            description={task.description}
            checked={task.checked}
            handleCheckTask={handleCheckTask}
            handleTaskToDelete={handleTaskToDelete}
            handleTaskIdToUpdate={handleTaskIdToUpdate}
            handleDoneTask={handleDoneTask}
            />)
          : <p className="no-tasks messages">There are no tasks</p>}
      </ul>

      <div className="check-buttons-container">
        <div className="check-buttons">
          {filteredTasks.length ? <button className="check-all-tasks-button" onClick={handleCheckAll}>{ someChecked ? 'Uncheck all' : 'Check all' }</button> : null}
          {filteredTasks.length ? <button className="delete-all-tasks-button" onClick={handleDeleteAll}>Delete all checked</button> : null}
        </div>
      </div>

    </div>
  )
}

export default Home;