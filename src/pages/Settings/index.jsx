import './styles.css';
import { useState } from 'react';
import { AiOutlineCopyrightCircle } from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'

const Settings = () => {
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  
  const toggleEditName = () => {
    setEditingName(!editingName);
  }

  const toggleEditEmail = () => {
    setEditingEmail(!editingEmail);
  }

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-header">
          <h2>General Settings</h2>
        </div>
        <ul className="ul-container">
          <li className="li-box">
            <div onClick={toggleEditName} style={{ display: editingName ? 'none' : 'block', width: '100%' }}>
              <div className="li-content">
                <span className="li-header header">Name</span>
                <p className="li-content-p">Patren</p>
                <span className="li-edit">Edit</span>
              </div>
            </div>
            <div className="li-content-edit-name" style={{ display: !editingName ? 'none' : 'block', width: '100%' }}>
              <div className="li-main-content">
                <div className="edit-name-header header">Name</div>
                <div className="edit-name-content">
                  <div className="edit-name-content-header">
                    New name<input type="text" className="input-edit"/>
                  </div>
                  <div className="observation">
                    <strong style={{ color: '#1C1E21' }}>Observation:</strong> if you change your Mind Organizer name you won't be able to change again before 60 days
                  </div>
                  <div className="buttons-container">
                    <button className="button-editing confirm-edit">Confirm changes</button>
                    <button className="button-editing cancel-edit" onClick={toggleEditName}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <span className="line"></span>
          <li className="li-box">
            <div onClick={toggleEditEmail} style={{ display: editingEmail ? 'none' : 'block', width: '100%' }}>
              <div className="li-content">
                <span className="li-header header">Email</span>
                <p className="li-content-p">devcaiofelipe15@gmail.com</p>
                <span className="li-edit">Edit</span>
              </div>
            </div>
            <div className="li-content-edit-email" style={{ display: !editingEmail ? 'none' : 'block', width: '100%' }}>
              <div className="li-main-content">
                <div className="edit-name-header header">Email</div>
                <div className="edit-name-content">
                  <div className="edit-name-content-header-email">
                    New email<input type="text" className="input-edit"/>
                  </div>
                  <div className="message">
                    <p>We'll use this email to send you marketing updates and notifications about your personal account</p>
                  </div>
                  <div className="buttons-container">
                    <button className="button-editing confirm-edit">Confirm changes</button>
                    <button className="button-editing cancel-edit" onClick={toggleEditEmail}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <footer className="footer-container">
          <span>Mind organizer <AiOutlineCopyrightCircle className="copyright"/> 2023</span>
          <button className="delete-acc-button">Delete my account<BsTrash/></button>
        </footer>
      </div>
    </div>
  )
}

export default Settings;