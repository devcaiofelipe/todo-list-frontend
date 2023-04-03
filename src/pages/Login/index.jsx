import './styles.css'
import { useState, useEffect } from 'react';
import { RiTodoLine } from "react-icons/ri";
import {
  useNavigate,
} from "react-router-dom";
import firebase from '../../shared/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { MdAddAPhoto } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import logo from '../../assets/2.jpg'


const auth = getAuth(firebase); 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoad, setLoginLoad] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const navigation = useNavigate();


  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState('');
  const [userProfilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (isSigned === true) {
      navigation('home')
    }
  }, [isSigned, navigation])

  const handleUserName = (e) => setUserName(e.target.value);
  const handleUserEmail = (e) => setUserEmail(e.target.value);
  const handleUserPassword = (e) => setUserPassword(e.target.value);
  const handleUserPasswordConfirmation = (e) => setUserPasswordConfirmation(e.target.value);

  const hasAllFields = () => userName && userEmail && userPassword && userPasswordConfirmation

  const toggleScreen = () => {
    setIsLoginScreen(!isLoginScreen);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoad(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = userCredential.accessToken;
      localStorage.setItem('token', token);
      setIsSigned(true);
    } catch (error) {
      console.error(error);
      setWrongCredentials(true);
      setIsSigned(false);
    } finally {
      setLoginLoad(false);
    } 
  }

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    const newUser = await createUserWithEmailAndPassword(auth, userEmail, userPassword)
    await updateProfile(newUser.user.auth.currentUser, {
      displayName: 'Caiozao',
      disabled: false,
    })
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  const handleProfilePicture = (e) => {
    setProfilePicture(e.target.files[0])
  }

  return (
    <div className="container">
      <header className="header-login">
        <RiTodoLine></RiTodoLine>
        <p>Mind Organizer</p>
      </header>

      { isLoginScreen ? (
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <p className="login-title">Login</p>
            <FiLogIn className="login-icon"/>
          </div>
          
          <p className="login-info">Type your e-mail and password below to sign in at Mind Organizer</p>
          <form action="#" className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email-input" className="label" style={ wrongCredentials ? {
              color: '#FF0839',
            } : null }>E-mail</label>
            <input id="email-input"type="text" className="form-input" placeholder="E-mail" onChange={handleEmail} style={wrongCredentials ? {
              border: '2px solid #FF0839',
              backgroundColor: email ? '#ebebf5' : 'white'
            } : { backgroundColor: email ? '#ebebf5' : 'white' } }/>
            <label htmlFor="password-input" className="label" style={ wrongCredentials ? {
              color: '#FF0839',
            } : null }>Password</label>
            <input id="password-input" type="password" className="form-input" placeholder="Password" onChange={handlePassword} style={wrongCredentials ? {
              border: '2px solid #FF0839',
              backgroundColor: password ? '#ebebf5' : 'white'
            } : { backgroundColor: password ? '#ebebf5' : 'white' } }/>
            { <p className="error-message" style={ wrongCredentials ? { display: 'block' } : { visibility: 'hidden'}}>E-mail or password invalid</p>}
            <button type="submit" className="signin-button" style={!email || !password ? {
              backgroundColor: 'rgb(177, 177, 177)',
              color: 'black',
              cursor: 'default'
            } : null } disabled={!email || !password}>{ loginLoad ? <span className="loader"></span> : 'Sign in' }</button>
          </form>
          <div className="create-account">
            <p>Don't have an account?</p>
            <button onClick={toggleScreen}>Sign up</button>
          </div>
        </div>
      </div>
      ) : (
        <div className="creation-container">
          <div className="profile-picture-container">
            <label htmlFor="add-picture">
              <MdAddAPhoto className="camera-icon" onClick={() => console.log('Cliquei na fotinha')}/>
            </label>
            <input type="file" id="add-picture" onChange={handleProfilePicture}/>
            <img src={userProfilePicture ? URL.createObjectURL(userProfilePicture) : logo} alt="logo" className="profile-picture"/>
            
          </div>
          <form action="#" className="create-form" onSubmit={handleCreateUser}>
            <label htmlFor="input" className="label">Name</label>
            <input type="text" className="creation-account-input" placeholder="Your name" onChange={handleUserName} style={{ backgroundColor: userName ? '#ebebf5' : 'white'}}/>
            <label htmlFor="input" className="label">E-mail</label>
            <input type="text" className="creation-account-input" placeholder="youremail@example.com" onChange={handleUserEmail} style={{ backgroundColor: userEmail ? '#ebebf5' : 'white'}}/>
            <label htmlFor="input" className="label">Password</label>
            <input type="password" className="creation-account-input" placeholder="Password (6 characters minimum)" onChange={handleUserPassword} style={{ backgroundColor: userPassword ? '#ebebf5' : 'white'}}/>
            <label htmlFor="input" className="label">Confirmation</label>
            <input type="password" className="creation-account-input" placeholder="Type password again" onChange={handleUserPasswordConfirmation} style={{ backgroundColor: userPasswordConfirmation ? '#ebebf5' : 'white'}}/>
            <button type="submit" className="create-account-button" disabled={!hasAllFields()} style={ !hasAllFields() ? {
              backgroundColor: 'rgb(177, 177, 177)',
              color: 'black',
              cursor: 'default'
            } : null }>Create Account</button>
          </form>
          <div className="back-to-login">
            <p>Do you already have an account?</p>
            <button onClick={toggleScreen}>Sign In</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login;