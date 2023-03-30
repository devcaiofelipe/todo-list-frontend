import './styles.css'
import { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import Task from '../../components/Task'
import DeleteModal from '../../components/DeleteModal';
import UpdateModal from '../../components/UpdateModal';
import { VscAdd } from "react-icons/vsc";
import firebase from '../../shared/firebase';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, child, get, set, push, remove, update } from 'firebase/database';

const Home = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [someChecked, setSomeChecked] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [oldValue, setOldValue] = useState('');
  const [filterChoise, setFilterChoise] = useState('all');

  useEffect(() => {
    getAllTasks()
  }, [])

  const getAllTasks = () => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const dbRef = ref(getDatabase(firebase));
    get(child(dbRef, `tasks/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val())
        const normalizedTasks = keys.map((key) => ({
          id: key,
          description: snapshot.val()[key].description,
          checked: snapshot.val()[key].checked,
          status: snapshot.val()[key].status,
        }))
        console.log('normalizedTasks', normalizedTasks);
        setTasks(normalizedTasks);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal)
  }

  const toggleUpdateModal = () => {
    setUpdateModal(!updateModal)
  }

  const handleFilter = (e) => {
    setFilterChoise(e.target.value);
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

  // const handleAddTask = () => {
  // const dbRef = ref(getDatabase(firebase));
  // get(child(dbRef, `tasks/uuid-que-inventei-3`)).then((snapshot) => {
  // if (snapshot.exists()) {
  //   console.log('VALOOOR', snapshot.val());
  // } else {
  //   console.log("No data available");
  // }
  // }).catch((error) => {
  //   console.error(error);
  // });

  //   criar dados
  //   const db = getDatabase(firebase);
  //   const taskListRef = ref(db, 'tasks/uuid-que-inventei-3');
  //   const newTaskRef = push(taskListRef);
  //   set(newTaskRef, {
  //     taskId: 'uuid2',
  //     description: 'desc2',
  //     checked: 'true'
  //   });
  //   const isValid = validateInput(task);
  //   if (!isValid) {
  //     alert('You must type anything');
  //     return;
  //   }
  //   setTasks(prevState => {
  //     return [...prevState, {
  //       id: uuidv4(),
  //       description: task,
  //       checked: false,
  //       status: 'in-progress',
  //     }]
  //   });
  //   setFilterChoise('all')
  //   setTask('');
  // }

  const handleAddTask = () => {
    const isValid = validateInput(task);
    if (!isValid) {
      alert('You must type anything');
      return;
    }
    const auth = getAuth(firebase);
    const userId = auth.currentUser.uid;
    const db = getDatabase(firebase);
    const taskListRef = ref(db, `tasks/${userId}`);
    const newTaskRef = push(taskListRef);
    set(newTaskRef, {
      description: task,
      checked: false,
      status: 'in-progress'
    });
    getAllTasks()
    setFilterChoise('all')
    setTask('');
  }



  const handleDeleteTask = (taskId) => {
    const auth = getAuth(firebase);
    const userId = auth.currentUser.uid;
    const db = getDatabase(firebase);
    toggleDeleteModal()
    remove(ref(db, `tasks/${userId}/${taskId}`))
    getAllTasks();
  }

  const handleCheckTask = (taskId) => {
    if (!someChecked) {
      setSomeChecked(true);
    } else {
      const newTasks = tasks.map((task) => task.id === taskId ? { ...task, checked: !task.checked } : task)
      const totalChecked = newTasks.filter((task) => task.checked).length
      if (!totalChecked) {
        setSomeChecked(false);
      }
    }
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
    if (!someChecked) {
      const newTasks = tasks.map((task) => ({
        ...task,
        checked: true
      }))
      setTasks(newTasks);
      setSomeChecked(true);
    } else {
      const newTasks = tasks.map((task) => ({
        ...task,
        checked: false
      }))
      setTasks(newTasks);
      setSomeChecked(false);
    }

  }

  const handleKeyPressed = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  }

  const handleUpdateTask = (taskId, newDescription) => {
    const auth = getAuth(firebase);
    const userId = auth.currentUser.uid;
    const db = getDatabase(firebase);
    const task = tasks.filter((task) => task.id === taskId)[0];
    console.log('task', task)
    const newTask = { ...task, description: newDescription }
    const updates = {
      [`tasks/${userId}/${taskId}`]: newTask
    };
    update(ref(db), updates);
    getAllTasks();
    toggleUpdateModal()
  }

  const handleDoneTask = (taskId) => {
    const newTasks = tasks.map((task) => taskId === task.id ? { ...task, status: task.status === 'done' ? 'in-progress' : 'done' } : task);
    setTasks(newTasks);
  }

  const validateFilterLength = (tasks) => {
    const resultLength = tasks.filter((task) => {
      if (filterChoise === 'all') return task;
      return task.status === filterChoise;
    }).length;
    return resultLength > 0;
  }

  return (
    <div className="container">
      
      <header>
        <h1 className="messages color">Welcome back, Caio</h1>
        <p className="messages color">You've got {tasks.length} tasks coming up in the next days.</p>
      </header>

      <div className="handle-task-container">
        <input className="add-task-input messages" type="text" placeholder="Add new task..." autoFocus value={task} onChange={handleInputChange} onKeyDown={handleKeyPressed}></input>
        <button className="add-task-button" onClick={handleAddTask}><VscAdd /></button>
      </div>

      <div className="status-container">
        <select className="status-select" value={filterChoise} onChange={handleFilter}>
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
        {validateFilterLength(tasks) ?
          tasks
            .filter((task) => {
              if (filterChoise === 'all') return task;
              return task.status === filterChoise;
            })
            .map((task) => <Task key={task.id}
              task={task}
              description={task.description}
              checked={task.checked}
              handleCheckTask={handleCheckTask}
              handleTaskToDelete={handleTaskToDelete}
              handleTaskIdToUpdate={handleTaskIdToUpdate}
              handleDoneTask={handleDoneTask}
            />)
          : <p className="no-tasks messages color">There are no tasks</p>}
      </ul>

      <div className="check-buttons-container">
        <div className="check-buttons">
          {tasks.length ? <button className="check-all-tasks-button" onClick={handleCheckAll}>{someChecked ? 'Uncheck all' : 'Check all'}</button> : null}
          {tasks.length ? <button className="delete-all-tasks-button" onClick={handleDeleteAll}>Delete all checked</button> : null}
        </div>
      </div>

    </div>
  )
}

export default Home;