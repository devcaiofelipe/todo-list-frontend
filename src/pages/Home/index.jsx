import './styles.css'
import Task from '../../components/Task'
import DeleteModal from '../../components/DeleteModal';
import UpdateModal from '../../components/UpdateModal';
import firebase from '../../shared/firebase';
import defaultLogo from '../../assets/defaultLogo.jpeg'
import { VscAdd } from 'react-icons/vsc';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { BsGearFill } from 'react-icons/bs';
import { BsSearch } from 'react-icons/bs';
import { ImExit } from 'react-icons/im';
import { useState, useEffect, useContext } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, child, get, set, push, remove, update } from 'firebase/database';
import { LoadingContent } from '../../components/LoadingContent/index';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../../index';

const Home = () => {
  const navigation = useNavigate();
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [someChecked, setSomeChecked] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [oldValue, setOldValue] = useState('');
  const [filterChoise, setFilterChoise] = useState('all');
  const [search, setSearch] = useState('');
  const [loadingContent, setLoadingContent] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const { contextState } = useContext(GlobalContext)

  const getAllTasks = (currentUserID) => {
    const dbRef = ref(getDatabase(firebase));
    get(child(dbRef, `tasks/${currentUserID}`))
    .then((snapshot) => {
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
        setTasks([]);
      }
    })
    .catch((error) => {
      console.error('error 6', error);
    })
  }

  useEffect(() => {
    setLoadingContent(true);
    getAllTasks(contextState.uid);
    setTimeout(() => {
      setLoadingContent(false);
    }, 1000);
  }, [contextState.uid]);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  }

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  }

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  }

  const toggleUpdateModal = () => {
    setUpdateModal(!updateModal);
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
    const db = getDatabase(firebase);
    const taskListRef = ref(db, `tasks/${contextState.uid}`);
    const newTaskRef = push(taskListRef);
    const data = {
      description: task,
      checked: false,
      status: 'in-progress'
    }
    set(newTaskRef, data);
    setTasks(prevState => ([...prevState, data]))
    setFilterChoise('all');
    setTask('');
  }

  const handleDeleteTask = (taskId) => {
    const db = getDatabase(firebase);
    
    remove(ref(db, `tasks/${contextState.uid}/${taskId}`))
    .then(() => {
      getAllTasks(contextState.uid);
      toggleDeleteModal();
    })
    .catch((e) => console.error('error 10', e))
  }

  const handleCheckTask = (taskId) => {
    if (!someChecked) {
      setSomeChecked(true);
    } else {
      const newTasks = tasks.map((task) => task.id === taskId ? { ...task, checked: !task.checked } : task);
      const totalChecked = newTasks.filter((task) => task.checked).length
      if (!totalChecked) {
        setSomeChecked(false);
      }
    }
    const newTasks = tasks.map((task) => task.id === taskId ? { ...task, checked: !task.checked } : task);
    setTasks(newTasks);
  }

  const handleDeleteAll = () => {
    const db = getDatabase(firebase);
    tasks.forEach((task) => {
      if (task.checked) {
        remove(ref(db, `tasks/${contextState.uid}/${task.id}`))
        .then(() => {
          getAllTasks(contextState.uid);
        })
        .catch((e) => {
          console.error('error 7', e);
        })
      }
    })
  }

  const handleExit = () => {
    const auth = getAuth()
    signOut(auth)
    .then(() => {
      navigation('/');
    })
    .catch((e) => console.log('error 8', e));
  }

  const handleCheckAll = () => {
    if (!someChecked) {
      const newTasks = tasks.map((task) => ({
        ...task,
        checked: true,
      }))
      setTasks(newTasks);
      setSomeChecked(true);
    } else {
      const newTasks = tasks.map((task) => ({
        ...task,
        checked: false,
      }))
      setTasks(newTasks);
      setSomeChecked(false);
    }
  }

  const handleKeyPressed = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    };
  }

  const handleUpdateTask = (taskId, newDescription) => {
    const db = getDatabase(firebase);
    const task = tasks.filter((task) => task.id === taskId)[0];
    const newTask = { ...task, description: newDescription }
    const updates = {
      [`tasks/${contextState.uid}/${taskId}`]: newTask,
    };
    update(ref(db), updates)
    .then(() => {
      getAllTasks(contextState.uid);
      toggleUpdateModal();
    })
    .catch((e) => console.error('error 9', e));
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

  if (loadingContent) {
    return <LoadingContent/>
  }

  return (
    <div className="container">

      <header className="header-container">
        <p className="header-title">Mind Organizer</p>
        <div className="logout-container">
          <img src={ contextState.photoURL ? contextState.photoURL : defaultLogo } alt="logo" className="profile-picture-home" onClick={toggleDropdown}/>
          { dropdown ? <MdKeyboardArrowUp className="logout-icon" onClick={toggleDropdown}/> : <MdKeyboardArrowDown className="logout-icon" onClick={toggleDropdown}/>}
          <div className="user-dropdown" style={{ display: dropdown ? 'block' : 'none'}}>
            <div className="user-dropdown-content">
              <Link to="/settings" className="dropdown-message">
                <div className="item-container">
                  <div className="icon-container"><BsGearFill className="icon"/></div>
                  <p className="title-settings">Settings</p>
                </div>
              </Link>
              <div className="item-container" onClick={handleExit}>
                <div className="icon-container"><ImExit className="icon exit"/></div>
                <p className="dropdown-message">Sign Out</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="title-content">
        <div>
          <h1 className="messages color">Welcome, {contextState.displayName || 'guest'}</h1>
          <p className="messages color">You've got {tasks.length} tasks coming up in the next days.</p>
        </div>
      </div>

      <div className="handle-task-container">
        <input className="add-task-input messages" type="text" placeholder="Add a new task" autoFocus value={task} onChange={handleInputChange} onKeyDown={handleKeyPressed}></input>
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