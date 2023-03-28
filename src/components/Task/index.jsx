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
    <div className="task-container-border" style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: checked ? '#444791' : 'white', borderRadius: '8px' }}>
      <li key={task.id} className="task-container" style={ { backgroundColor: task.status === 'done' ? '#e8f3df' : 'white',
        transition: "all .5s ease",
        WebkitTransition: "all .5s ease",
        MozTransition: "all .5s ease" }}>
        <div className="task-start">
          <input type="checkbox" checked={checked} onChange={() => handleCheckTask(task.id)} className="task-container-checkbox"/>
          <p className="task-description messages">{description}</p>
        </div>
        <div className="task-options-buttons">
          <button className="task-container-button update-button" onClick={() => handleTaskIdToUpdate(task.id)}><BsPencil/></button>
          <button className="task-container-button done-button" onClick={() => handleDoneTask(task.id)}>{ task.status === 'done' ? <MdRemoveDone/> : <MdDone/>}</button>
          <button className="task-container-button confirm-button" onClick={() => handleTaskToDelete(task.id)}><BsTrash/></button>
        </div>
      </li>
    </div>
    
  )
}

export default Task;