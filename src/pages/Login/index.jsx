import './styles.css'
import { useState, useEffect } from 'react';
import { RiTodoLine } from "react-icons/ri";
import {
  useNavigate,
} from "react-router-dom";
import firebase from '../../shared/firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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

  useEffect(() => {
    if (isSigned === true) {
      navigation('home')
    }
  }, [isSigned, navigation])

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
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
          <p className="login-title">Login</p>
          <p className="login-info">Type your e-mail and password below to sign in at Mind Organizer</p>
          <form action="#" className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email-input" className="label" style={ wrongCredentials ? {
              color: '#FF0839',
            } : null }>E-mail</label>
            <input id="email-input"type="text" className="form-input" placeholder="E-mail" onChange={handleEmail} style={wrongCredentials ? {
              border: '2px solid #FF0839'
            } : null }/>
            <label htmlFor="password-input" className="label" style={ wrongCredentials ? {
              color: '#FF0839',
            } : null }>Password</label>
            <input id="password-input" type="password" className="form-input" placeholder="Password" onChange={handlePassword} style={wrongCredentials ? {
              border: '2px solid #FF0839'
            } : null }/>
            { wrongCredentials && <span className="error-message">E-mail or password invalid</span>}
            <button type="submit" className="signin-button" style={!email || !password ? {
              backgroundColor: 'rgb(177, 177, 177)',
              color: 'black',
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
            <img src={logo} alt="logo" className="profile-picture"/>
          </div>
          <form className="create-form">
            <label htmlFor="input" className="label">Name</label>
            <input id="input"type="text" className="creation-account-input" placeholder="Your name"/>
            <label htmlFor="input" className="label">E-mail</label>
            <input id="input"type="text" className="creation-account-input" placeholder="youremail@example.com"/>
            <label htmlFor="input" className="label">Password</label>
            <input id="input"type="password" className="creation-account-input" placeholder="Password (6 characters minimum)"/>
            <label htmlFor="input" className="label">Confirmation</label>
            <input id="input"type="password" className="creation-account-input" placeholder="Type password again"/>
            <button type="submit" className="create-account-button">Create Account</button>
          </form>
          <div className="policy-container">
            <div className="service-terms-container">
              <input type="checkbox" checked={false} className="task-container-checkbox"/>
              <p>I agree to be bound by the project <a href="/not-found">service terms</a></p>
            </div>
          </div>
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