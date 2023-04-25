import './styles.css';
import { AiOutlineCloseCircle } from "react-icons/ai";

const DeleteAccountModal = ({ toggleModal, deleteAction }) => {
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
          Do you really want to delete your account? this process cannot be undone
        </p>
        <div className="buttons">
          <button onClick={toggleModal} className="button cancel font">
            Cancel
          </button>
          <button onClick={() => deleteAction()} className="button confirm font">      
            Delete
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default DeleteAccountModal;