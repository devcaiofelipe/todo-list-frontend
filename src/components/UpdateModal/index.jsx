import './styles.css';
import { HiPencilAlt } from "react-icons/hi";

const UpdateModal = ({ toggleModal }) => {
  return (
    <div className="modal">
      <div onClick={toggleModal} className="overlay"></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="font">Edit Task</h2>
            <i>
              <HiPencilAlt className="modal-icon-update"/>
            </i>
          
        </div>
        <input type="text" className="task-update-input"/>
        
        <div className="buttons-update">
          <button onClick={toggleModal} className="button cancel font">
            Cancel
          </button>
          <button className="button update font">      
            Update
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default UpdateModal;