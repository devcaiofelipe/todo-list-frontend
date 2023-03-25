import './styles.css';
import { BsTrash, BsPencil } from "react-icons/bs";
import { MdDone, MdRemoveDone } from "react-icons/md";


const Task = ({ 
  task, 
  description, 
  checked, 
  handleCheckTask, 
  handleTaskToDelete, 
  handleTaskIdToUpdate, 
  handleDoneTask }) => {

  return (
    <div className="task-container-border"style={ checked ? { borderStyle: 'solid', borderWidth: '1px', borderColor: '#286ef1', borderRadius: '8px' } : { borderStyle: 'solid', borderWidth: '1px', borderColor: 'white', borderRadius: '8px' } }>
      <li key={task.id} className="task-container" style={ task.done ? { backgroundColor: '#e8f3df' } : null }>
      <div>
          <input type="checkbox" checked={checked} onChange={() => handleCheckTask(task.id)} className="task-container-checkbox"/>
          <p className="messages">{description}</p>
        </div>
      <div>
        <button className="task-container-button done-button" onClick={() => handleDoneTask(task.id)}>{ task.done ? <MdRemoveDone/> : <MdDone/>}</button>
        <button className="task-container-button update-button" onClick={() => handleTaskIdToUpdate(task.id)}><BsPencil/></button>
        <button className="task-container-button confirm-button" onClick={() => handleTaskToDelete(task.id)}><BsTrash/></button>
      </div>
    </li>
    </div>
    
  )
}

export default Task;