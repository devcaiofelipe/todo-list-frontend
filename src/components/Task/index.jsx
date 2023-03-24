import './styles.css';
import { BsTrash, BsPencil } from "react-icons/bs";


const Task = ({ taskId, description, checked, handleCheckTask, handleTaskToDelete, handleTaskToUpdate }) => {
  return (
    <li key={taskId} className="task-container" style={ checked ? { borderStyle: 'solid', borderWidth: '2px', borderColor: 'red' } : null }>
      <div>
        <input type="checkbox" checked={checked} onChange={() => handleCheckTask(taskId)} className="task-container-checkbox"/>
        <p className="messages">{description}</p>
      </div>
      <div>
        <button className="task-container-button update-button" onClick={() => handleTaskToUpdate(taskId)}><BsPencil/></button>
        <button className="task-container-button confirm-button" onClick={() => handleTaskToDelete(taskId)}><BsTrash/></button>
      </div>
    </li>
  )
}

export default Task;