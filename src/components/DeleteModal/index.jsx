import './styles.css';
import { AiOutlineCloseCircle } from "react-icons/ai";

const DeleteModal = ({ toggleModal }) => {


  return (
    <div className="modal">
      <div onClick={toggleModal} className="overlay"></div>
      <div className="modal-content">
        <div className="modal-test">
          <i>
            <AiOutlineCloseCircle className="modal-icon"/>
          </i>
        </div>
        <h2 className="font">Are you sure?</h2>
        <p className="font">
          Do you really want to delete this records? this process cannot be undone
        </p>
        <div className="buttons">
          <button onClick={toggleModal} className="button cancel font">
            Cancel
          </button>
          <button onClick={toggleModal} className="button confirm font">      
            Delete
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default DeleteModal;