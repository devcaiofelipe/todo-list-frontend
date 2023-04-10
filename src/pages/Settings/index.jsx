import './styles.css';
import { AiOutlineCopyrightCircle } from 'react-icons/ai'

const Settings = () => {
  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-header">
          <h2>General Settings</h2>
        </div>
        <ul className="ul-container">
          <li className="li-content">
            <span className="li-header">Name</span>
            <p className="li-content">Patren</p>
            <span className="li-edit">Edit</span>
          </li>
          <span className="line"></span>
          <li className="li-content">
            <span className="li-header">E-mail</span>
            <p className="li-content">devcaiofelipe15@gmail.com</p>
            <span className="li-edit">Edit</span>
          </li>
          <span className="line"></span>
          <li className="li-content">
            <span className="li-header">Status</span>
            <p className="li-content">Enabled</p>
            <span className="li-edit">Edit</span>
          </li>
        </ul>
        <footer className="footer-container">
          <span>Mind organizer <AiOutlineCopyrightCircle className="copyright"/> 2023</span>
        </footer>
      </div>
    </div>
  )
}

export default Settings;