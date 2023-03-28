import './styles.css'
import { useState } from 'react';
import { RiTodoLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";

const Login = () => {
  let history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wrongCredentials, setWrongCredentials] = useState(false);

  const handleSubmit = () => {
    if (email === 'email@gmail.com' && password === 'senha123') {
      history.push("/home");
    } else {
      setWrongCredentials(true);
    }
  }

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
        <p>Caio's TD List</p>
      </header>
      <div className="login-container">
        <div className="login-content">
          <p className="login-title">Login</p>
          <p className="login-info">Type your e-mail and password below to sign in at To Do List</p>
          <form action="#" className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email-input" className="label" style={{
              color: wrongCredentials ? '#FF0839' : '#232555',
            }}>E-mail</label>
            <input id="email-input"type="text" className="form-input" placeholder="E-mail" onChange={handleEmail} style={wrongCredentials ? {
              border: '2px solid #FF0839'
            } : null }/>
            <label htmlFor="password-input" className="label" style={{
              color: wrongCredentials ? '#FF0839' : '#232555',
            }}> Password</label>
            <input id="password-input" type="password" className="form-input" placeholder="Password" onChange={handlePassword} style={wrongCredentials ? {
              border: '2px solid #FF0839'
            } : null }/>
            { wrongCredentials && <span className="error-message">E-mail or password invalid</span>}
            <button type="submit" className="signin-button" style={!email || !password ? {
              backgroundColor: 'rgb(177, 177, 177)',
              color: 'black',
            } : null } disabled={!email || !password}>Sign in</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;