import './styles.css';
import { HiPencilAlt } from "react-icons/hi";
import { useState } from "react";

const UpdateModal = ({ toggleModal, idToUpdate, handleUpdateTask, oldValue }) => {
  const [newDescription, setNewDescription] = useState(oldValue);

  const handleInputChange = (event) => {
    setNewDescription(event.target.value);
  }

  const handleKeyPressed = (e) => {
    if (e.key === 'Enter') {
      handleUpdateTask(idToUpdate, newDescription)
    }
  }

  return (
    <div className="modal">
      <div onClick={toggleModal} className="overlay-update"></div>
      <div className="modal-content-update ">
        <div className="modal-header">
          <h2 className="font">Edit Task</h2>
            <i>
              <HiPencilAlt className="modal-icon-update"/>
            </i>
          
        </div>

        <input type="text" className="task-update-input" autoFocus placeholder="New task..." value={newDescription} onChange={handleInputChange} onKeyDown={handleKeyPressed}/>
        
        <div className="buttons-update">
          <button onClick={toggleModal} className="button cancel font">
            Cancel
          </button>
          <button className="button update font" onClick={() => handleUpdateTask(idToUpdate, newDescription)}>      
            Update
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default UpdateModal;