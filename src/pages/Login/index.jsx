import './styles.css'
import { useState, useEffect } from 'react';
import { RiTodoLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import firebase from '../../shared/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import storage from '../../shared/firebaseStorage'
import { ref, uploadBytes } from 'firebase/storage';
import { MdAddAPhoto } from 'react-icons/md';
import { FiLogIn } from 'react-icons/fi';
import logo from '../../assets/2.jpg'

const auth = getAuth(firebase); 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoad, setLoginLoad] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isLoginScreen, setIsLoginScreen] = useState(true);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState('');
  const [userProfilePicture, setProfilePicture] = useState(null);
  
  const [wrongEmail, setWrongEmail] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [userWasCreated, setUserWasCreated] = useState(false);

  const navigation = useNavigate();

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

  const login = async () => {
    setLoginLoad(true)
    const emailToLogin = userWasCreated ? userEmail : email;
    const passwordToLogin = userWasCreated ? userPassword : password;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailToLogin, passwordToLogin)
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

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  }

  const validateCreateInputs = () => {
    const errors = [];
    let containsError = false;
    if (!userEmail.includes('@')) {
      setWrongEmail(true)
      containsError = true;
    }
    if (userPassword !== userPasswordConfirmation) {
      errors.push('The password confirmation does not match');
      containsError = true;
    }
    if (userPassword.length < 6) {
      errors.push('Password must contains at least 6 characters')
      containsError = true;
    }
    if (!/[A-Z]/.test(userPassword)) {
      errors.push('Password must contains at least one uppercase character')
      containsError = true;
    }
    if (!/[a-z]/.test(userPassword)) {
      errors.push('Password must contains at least one lowercase character')
      containsError = true;
    }
    if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g.test(userPassword)) {
      errors.push('Password must contains at least one special character')
      containsError = true;
    }
    setPasswordErrors(errors)
    return containsError;
  }

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const hasError = validateCreateInputs();
    if (hasError) return;
    try {
      setCreateUserLoading(true);
      const newUser = await createUserWithEmailAndPassword(auth, userEmail.toLocaleLowerCase(), userPassword)
      let photoURL = null;
      if (userProfilePicture) {
        const pathRef = ref(storage, `pictures/${newUser.user.auth.currentUser.uid}/photo.png`);
        const result = await uploadBytes(pathRef, userProfilePicture);
        photoURL = result.metadata.fullPath;
      }
      
      await updateProfile(newUser.user.auth.currentUser, {
        displayName: userName,
        ...(photoURL && { photoURL }),
        disabled: false,
      })
      setUserWasCreated(true);
    } catch (e) {
      if (e.message === 'Firebase: Error (auth/invalid-email).') {
        setWrongEmail(true)
      }
    } finally {
      setCreateUserLoading(false);
    }
    await login();
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
          <form action="#" className="login-form" onSubmit={handleLogin}>
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
              <MdAddAPhoto className="camera-icon"/>
            </label>
            <input type="file" id="add-picture" onChange={handleProfilePicture}/>
            <img src={userProfilePicture ? URL.createObjectURL(userProfilePicture) : logo} alt="logo" className="profile-picture"/>
            
          </div>
          <form action="#" className="create-form" onSubmit={handleCreateUser}>
            <label htmlFor="input" className="label">Name</label>
            <input type="text" className="creation-account-input" placeholder="Your name" onChange={handleUserName}/>
            <label htmlFor="input" className="label" style={ wrongEmail ? {
              color: '#FF0839',
            } : null}>E-mail</label>
            <input type="text" className="creation-account-input" placeholder="youremail@example.com" onChange={handleUserEmail} style={{ backgroundColor: userEmail ? '#ebebf5' : 'white', ...(wrongEmail && { border: '2px solid #FF0839' })}}/>
            <p className="error-message" style={ { display: wrongEmail ? 'block' : 'none' }}>Invalid e-mail</p>
            <label htmlFor="input" className="label" style={ passwordErrors.length ? {
              color: '#FF0839',
            } : null}>Password</label>
            <input type="password" className="creation-account-input" placeholder="Password (6 characters minimum)" onChange={handleUserPassword} style={{ backgroundColor: userPassword ? '#ebebf5' : 'white', ...(passwordErrors.length && { border: '2px solid #FF0839' })}}/>
            <label htmlFor="input" className="label" style={ passwordErrors.length ? {
              color: '#FF0839',
            } : null}>Confirmation</label>
            <input type="password" className="creation-account-input" placeholder="Type password again" onChange={handleUserPasswordConfirmation} style={{ backgroundColor: userPasswordConfirmation ? '#ebebf5' : 'white', ...(passwordErrors.length && { border: '2px solid #FF0839' })}}/>
            <ul style={{ display: passwordErrors.length ? 'block' : 'none' }} className="messages-errors-container">
              { passwordErrors.map((message, i) => <li key={i} className="error-message">{message}</li>)}
            </ul>

            <div className="spinner-container-overlay" style={{ display: createUserLoading ? 'block' : 'none' }}>
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
            
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