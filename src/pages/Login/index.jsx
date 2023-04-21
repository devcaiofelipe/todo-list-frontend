import './styles.css'
import defaultLogo from '../../assets/defaultLogo.jpeg'
import storage from '../../shared/firebaseStorage'
import firebase from '../../shared/firebase';
import { useState, useEffect, useContext, useCallback } from 'react';
import { RiTodoLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
 } from 'firebase/auth';
import { ref, uploadBytes } from 'firebase/storage';
import { MdAddAPhoto } from 'react-icons/md';
import { TfiGoogle } from 'react-icons/tfi';
import { FiLogIn } from 'react-icons/fi';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { GlobalContext } from '../../index';
import { getStorage, ref as refDatabase, getDownloadURL } from 'firebase/storage';
// const auth = getAuth(firebase); 

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

  const [passwordInvisible, setPasswordInvisible] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const { contextState, setContextState } = useContext(GlobalContext)

  const navigation = useNavigate();

  const handleUserInfo = useCallback((user) => {
    const userId = user.uid;
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const isGoogleAuth = user.providerId === 'google.com';
    try {
      if (!isGoogleAuth) {
        const storage = getStorage();
        const pathReference = refDatabase(storage, `pictures/${userId}/photo.png`);
        console.log('paath', pathReference);
        getDownloadURL(pathReference).then((url) => {
          setContextState({ uid: userId, displayName, email, photoURL: url, isGoogleAuth })
        })
      } else {
        console.log()
        setContextState({ uid: userId, displayName, email, photoURL, isGoogleAuth })
      }
    } catch (e) {
      console.error(e);
    }
  }, [setContextState])

  useEffect(() => {
    if (!isSigned) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation('home')
      } else {
        navigation('/')
      }
    });
    } else if (isSigned) {
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

  const togglePasswordVisible = () => {
    setPasswordInvisible(!passwordInvisible);
  }

  const login = async (userEmail, userPassword) => {
    setLoginLoad(true)
    const emailToLogin = userEmail || email;
    const passwordToLogin = userPassword || password;
    try {
      const auth = getAuth(firebase); 
      await signInWithEmailAndPassword(auth, emailToLogin, passwordToLogin)
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
    if (!/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/g.test(userPassword)) {
      errors.push('Password must contains at least one special character')
      containsError = true;
    }
    setPasswordErrors(errors)
    return containsError;
  }

  const handleCreateUser = (e) => {
    e.preventDefault();
    const hasError = validateCreateInputs();
    if (hasError) return;
    try {
      setCreateUserLoading(true);
      const auth = getAuth(firebase); 
      createUserWithEmailAndPassword(auth, userEmail.toLocaleLowerCase(), userPassword)
      .then((newUser) => {
        let photoURL = null;
        if (userProfilePicture) {
          const pathRef = ref(storage, `pictures/${newUser.user.auth.currentUser.uid}/photo.png`);
          uploadBytes(pathRef, userProfilePicture)
          .then((result) => {
            photoURL = result.metadata.fullPath;
          })
        }
        updateProfile(newUser.user.auth.currentUser, {
          displayName: userName,
          ...(photoURL && { photoURL }),
          disabled: false,
        }).then(async () => {
          await login(userEmail, userPassword);
        })
      
      })
    } catch (e) {
      if (e.message === 'Firebase: Error (auth/invalid-email).') {
        setWrongEmail(true)
      }
    } finally {
      setCreateUserLoading(false);
    }
  }

  const handleLoginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .catch((error) => {
      navigation('/')
    });
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
            <div className="password-container">
              <label htmlFor="password-input" className="label" style={ wrongCredentials ? {
                color: '#FF0839',
              } : null }>Password</label>
              <input id="password-input" type={passwordInvisible ? 'password' : 'text' } className="form-input-password" placeholder="Password" onChange={handlePassword} style={wrongCredentials ? {
                border: '2px solid #FF0839',
                backgroundColor: password ? '#ebebf5' : 'white'
              } : { backgroundColor: password ? '#ebebf5' : 'white' } }/>
              { passwordInvisible ? <AiFillEye className="eye-icon-invisible" onClick={togglePasswordVisible}/> : <AiFillEyeInvisible className="eye-icon-invisible" onClick={togglePasswordVisible}/>}
            </div>
            
            { <p className="error-message-1" style={ wrongCredentials ? { display: 'block' } : { visibility: 'hidden'}}>E-mail or password invalid</p>}
            <button type="submit" className="signin-button" style={!email || !password ? {
              backgroundColor: 'rgb(177, 177, 177)',
              color: 'black',
              cursor: 'default',
            } : null } disabled={!email || !password}>{ loginLoad ? <span className="loader"></span> : 'Sign in' }</button>
          </form>
          <button className="signin-with-google" onClick={handleLoginWithGoogle}><TfiGoogle className="google-icon"/>Sign in with google</button>
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
            <img src={ userProfilePicture ? URL.createObjectURL(userProfilePicture) : defaultLogo } alt="logo" className="profile-picture"/>
          </div>
          <form action="#" className="create-form" onSubmit={handleCreateUser}>
            <label htmlFor="input" className="label">Name</label>
            <input type="text" className="creation-account-input" placeholder="Your name" onChange={handleUserName} style={{ backgroundColor: userName ? '#ebebf5' : 'white' }}/>
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
            
            <button type="submit" className="create-account-button" disabled={!hasAllFields() || createUserLoading} style={ !hasAllFields() || createUserLoading ? {
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