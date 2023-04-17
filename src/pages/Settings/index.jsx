import './styles.css';
import { useState, useContext } from 'react';
import { AiOutlineCopyrightCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { GlobalContext } from '../../index';
import {
  getAuth,
  updateProfile,
  updateEmail,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { MdAddAPhoto } from 'react-icons/md';
import { ref, uploadBytes } from 'firebase/storage';
import { ImExit } from 'react-icons/im';
import { Link } from 'react-router-dom';
import { ref as refDatabase, getDownloadURL } from 'firebase/storage'
import defaultLogo from '../../assets/defaultLogo.jpeg';
import storage from '../../shared/firebaseStorage';

const Settings = () => {
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEdittingPassword] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState(false);
  const [oldPasswordWrong, setOldPasswordWrong] = useState(false);
  const [userProfilePicture, setProfilePicture] = useState(null);

  const { contextState, setContextState } = useContext(GlobalContext);
  const navigation = useNavigate();

  const toggleEditName = () => {
    setEditingName(!editingName);
  }

  const toggleEditEmail = () => {
    setEditingEmail(!editingEmail);
  }

  const toggleEditPassword = () => {
    setPasswordDoesNotMatch(false);
    setOldPasswordWrong(false);
    setEdittingPassword(!editingPassword);
  }

  const handleName = (e) => {
    setNewName(e.target.value);
  }

  const handleEmail = (e) => {
    setNewEmail(e.target.value);
  }

  const handleOldPassword = (e) => {
    setOldPassword(e.target.value);
  }

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  }

  const handleNewPasswordConfirmation = (e) => {
    setNewPasswordConfirmation(e.target.value);
  }

  const handleProfilePicture = (e) => {
    setProfilePicture(e.target.files[0])
  }

  const handleUpdateUserName = () => {
    const auth = getAuth();
    const normalizedName = newName.split(' ').map((name) => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
    updateProfile(auth.currentUser, {
      displayName: normalizedName
    }).then(() => {
      setContextState(prevState => ({ ...prevState, displayName: normalizedName }))
      toggleEditName(!editingName)
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleUpdateUserEmail = () => {
    const auth = getAuth();
    const email = newEmail.toLocaleLowerCase();
    updateEmail(auth.currentUser, email).then(() => {
      toggleEditEmail(!editingEmail)
      signOut(auth).then(() => {
        navigation('/')
      })
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleUpdatePassword = () => {
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword
    )
    if (newPassword !== newPasswordConfirmation) {
      setPasswordDoesNotMatch(true);
      return;
    }
    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        updatePassword(auth.currentUser, newPassword);
        signOut(auth).then(() => navigation('/'))
      })
      .catch((e) => {
        if (e.message === 'Firebase: Error (auth/wrong-password).') {
          setOldPasswordWrong(true);
        }
      });
  }

  const updateProfilePicture = async () => {
    const auth = getAuth();
    if (userProfilePicture) {
      const pathRef = ref(storage, `pictures/${auth.currentUser.uid}/photo.png`);
      const result = await uploadBytes(pathRef, userProfilePicture).catch((e) => console.log('errorr', e))
      const photoURL = result.metadata.fullPath;
      await updateProfile(auth.currentUser, {
        photoURL,
      })
      const pathReference = refDatabase(storage, `pictures/${auth.currentUser.uid}/photo.png`);
      const url = await getDownloadURL(pathReference)
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        setContextState(prevState => ({ ...prevState, photoURL: xhr.response }))
      };
      xhr.open('GET', url);
      xhr.send();
      setProfilePicture(null)
    }
  }

  const definePicture = () => {
    if (userProfilePicture) return userProfilePicture;
    if (contextState.photoURL) return contextState.photoURL;
    return false;
  }

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigation('/');
    });
  }

  return (
    <>
      <header className="header-container-settings">
        <Link to="/home" className="header-title-settings">Mind Organizer</Link>
        <div className="logout-container">
          <button onClick={handleSignOut}><ImExit className="exit-icon"/></button>
        </div>
        
      </header>
      <div className="settings-container">
        <div className="settings-content">
          <div className="settings-header">
            <h2>General Settings</h2>
            <div className="update-picture">
              <label htmlFor="add-picture-settings">
                <MdAddAPhoto className="camera-icon-settings" />
              </label>
              <input style={{ display: 'none' }} type="file" id="add-picture-settings" onChange={handleProfilePicture} />
              <img src={definePicture() ? URL.createObjectURL(definePicture()) : defaultLogo} alt="logo" className="profile-picture-settings" />
              {userProfilePicture && <button onClick={updateProfilePicture}>Confirm</button>}
            </div>

          </div>
          <ul className="ul-container">
            <li className="li-box">
              <div onClick={toggleEditName} style={{ display: editingName ? 'none' : 'block', width: '100%' }}>
                <div className="li-content">
                  <span className="li-header header">Name</span>
                  <p className="li-content-p">{contextState.displayName}</p>
                  <span className="li-edit">Edit</span>
                </div>
              </div>
              <div className="li-content-edit-name" style={{ display: !editingName ? 'none' : 'block', width: '100%' }}>
                <div className="li-main-content">
                  <div className="edit-name-header header">Name</div>
                  <div className="edit-name-content">
                    <div className="edit-name-content-header">
                      New name<input type="text" className="input-edit" onChange={handleName} />
                    </div>
                    <div className="observation">
                      <strong style={{ color: '#1C1E21' }}>Observation:</strong> if you change your Mind Organizer name you won't be able to change again before 60 days
                    </div>
                    <div className="buttons-container">
                      <button className="button-editing confirm-edit" onClick={handleUpdateUserName}>Confirm changes</button>
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
                  <p className="li-content-p">{contextState.email}</p>
                  <span className="li-edit">Edit</span>
                </div>
              </div>
              <div className="li-content-edit-email" style={{ display: !editingEmail ? 'none' : 'block', width: '100%' }}>
                <div className="li-main-content">
                  <div className="edit-name-header header">Email</div>
                  <div className="edit-name-content">
                    <div className="edit-name-content-header-email">
                      New email<input type="text" className="input-edit" onChange={handleEmail} />
                    </div>
                    <div className="message">
                      <p>We'll use this email to send you marketing updates and notifications about your personal account</p>
                    </div>
                    <div className="buttons-container">
                      <button className="button-editing confirm-edit" onClick={handleUpdateUserEmail}>Confirm changes</button>
                      <button className="button-editing cancel-edit" onClick={toggleEditEmail}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="li-box">
              <div onClick={toggleEditPassword} style={{ display: editingPassword ? 'none' : 'block', width: '100%' }}>
                <div className="li-content">
                  <span className="li-header header">Password</span>
                  <p className="li-content-p">Change your password</p>
                  <span className="li-edit">Edit</span>
                </div>
              </div>
              <div className="li-content-edit-password" style={{ display: !editingPassword ? 'none' : 'block', width: '100%' }}>
                <div className="li-main-content">
                  <div className="edit-password-header header">Password</div>
                  <div className="main-password-container">
                    <div className="main-password-content">
                      <div className="tittle-password-names message-color">
                        <label htmlFor="old-password">Old Password</label>
                        <label htmlFor="new-password">New Password</label>
                        <label htmlFor="confirmation-password">Confirmation Password</label>
                      </div>
                      <div className="tittle-password-inputs">
                        <input type="password" className="input-edit" id="old-password" onChange={handleOldPassword} />
                        <input type="password" className="input-edit" id="new-password" onChange={handleNewPassword} />
                        <input type="password" className="input-edit" id="confirmation-password" onChange={handleNewPasswordConfirmation} />
                      </div>
                    </div>
                    <ul>
                      {oldPasswordWrong && <li className="error-message">Wrong old password</li>}
                      {passwordDoesNotMatch && <li className="error-message">Passwords does not match</li>}
                    </ul>

                    <div className="buttons-container">
                      <button className="button-editing confirm-edit" onClick={handleUpdatePassword}>Confirm changes</button>
                      <button className="button-editing cancel-edit" onClick={toggleEditPassword}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <footer className="footer-container">
            <span>Mind organizer <AiOutlineCopyrightCircle className="copyright" /> 2023</span>
            <button className="delete-acc-button">Delete my account<BsTrash /></button>
          </footer>
        </div>
      </div>
    </>
  )
}

export default Settings;