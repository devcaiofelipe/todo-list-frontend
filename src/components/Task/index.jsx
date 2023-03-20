import './styles.css';
import { BsTrash } from "react-icons/bs";


const Task = ({ taskId, description, checked, handleCheckTask, setTaskToDelete }) => {
  return (
    <li key={taskId} className="task-container">
      <div>
        <input type="checkbox" checked={checked} onChange={() => handleCheckTask(taskId)} className="task-container-checkbox"/>
        <span className="messages">{description}</span>
      </div>
      <button className="task-container-button" onClick={() => setTaskToDelete(taskId)}><BsTrash/></button>
    </li>
  )
}

export default Task;