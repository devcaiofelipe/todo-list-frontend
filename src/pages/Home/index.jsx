import './styles.css'
import { useState, useEffect } from 'react';
import Task from '../../components/Task'
import DeleteModal from '../../components/DeleteModal';
import UpdateModal from '../../components/UpdateModal';
import { VscAdd } from 'react-icons/vsc';
import { FiLogOut } from 'react-icons/fi';
import { BsSearch } from 'react-icons/bs';
import firebase from '../../shared/firebase';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, child, get, set, push, remove, update } from 'firebase/database';
import { getStorage, ref as refDatabase, getDownloadURL } from 'firebase/storage';
import defaultLogoGrey from '../../assets/profile-gray.jpeg'

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
  const [userInfo, setUserInfo] = useState({ displayName: 'Anonymous', photoURL: '' });
  const [search, setSearch] = useState('');
  const [valueToSearch, setValueToSearch] = useState('');

  useEffect(() => {
    handleUserInfo();
    getAllTasks()
  }, [])

  const handleUserInfo = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const user = auth.currentUser;
    const currentUser = userId ? userId : localStorage.getItem('userId')
    localStorage.setItem('userId', currentUser);
    const displayName = user.displayName;
    try {
      const storage = getStorage();
      const pathReference = refDatabase(storage, `pictures/${userId}/photo.png`);
      const url = await getDownloadURL(pathReference)
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        setUserInfo({ displayName, photoURL: xhr.response })
      };
      xhr.open('GET', url);
      xhr.send();
    } catch (e) {
      console.error(e);
    } finally {
      setUserInfo(prevState => ({ ...prevState, displayName }))
    }
  }

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  }

  const getAllTasks = () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const dbRef = ref(getDatabase(firebase));
    
    const currentUser = userId ? userId : localStorage.getItem('userId')
    localStorage.setItem('userId', userId);
    get(child(dbRef, `tasks/${currentUser}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val())
        const normalizedTasks = keys.map((key) => ({
          id: key,
          description: snapshot.val()[key].description,
          checked: snapshot.val()[key].checked,
          status: snapshot.val()[key].status,
        }))
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

  const handleAddTask = () => {
    const isValid = validateInput(task);
    if (!isValid) {
      alert('You must type anything');
      return;
    }
    const currentUser = localStorage.getItem('userId')
    const db = getDatabase(firebase);
    const taskListRef = ref(db, `tasks/${currentUser}`);
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
    const currentUser = localStorage.getItem('userId')
    const db = getDatabase(firebase);
    toggleDeleteModal()
    remove(ref(db, `tasks/${currentUser}/${taskId}`))
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
    const currentUser = localStorage.getItem('userId')
    const db = getDatabase(firebase);
    tasks.forEach((task) => {
      if (task.checked) {
        remove(ref(db, `tasks/${currentUser}/${task.id}`))
      }
    })
    getAllTasks();
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
    const currentUser = localStorage.getItem('userId')
    const db = getDatabase(firebase);
    const task = tasks.filter((task) => task.id === taskId)[0];
    const newTask = { ...task, description: newDescription }
    const updates = {
      [`tasks/${currentUser}/${taskId}`]: newTask
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
      
      <header className="header-content">
        <div>
          <h1 className="messages color">Welcome, {userInfo?.displayName || 'guest'}</h1>
          <p className="messages color">You've got {tasks.length} tasks coming up in the next days.</p>
        </div>
        <div className="logout-container">
          <img src={ userInfo.photoURL ? URL.createObjectURL(userInfo.photoURL) : defaultLogoGrey} alt="logo" className="profile-picture-home"/>
          <FiLogOut className="logout-icon"/>
        </div>
      </header>

      <div className="handle-task-container">
        <input className="add-task-input messages" type="text" placeholder="Add a new task..." autoFocus value={task} onChange={handleInputChange} onKeyDown={handleKeyPressed}></input>
        <button className="add-task-button" onClick={handleAddTask}><VscAdd /></button>
      </div>

      <div className="status-container">
        <div className="search-container">
          <input type="text" className="search-input messages" placeholder="Search for a task" onChange={handleSearchInput}/>
          <BsSearch className="search-icon"/>
        </div>
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
            .filter((task) => task.description.toLowerCase().includes(search.toLocaleLowerCase()))
            .filter((task) => {
              if (valueToSearch) {
                return task.description.toLowerCase().includes(search.toLocaleLowerCase())
              } else {
                return task;
              }
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