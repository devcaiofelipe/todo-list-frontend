import './styles.css'
import { RiTodoLine } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  return (
    <div className="container">
      <header className="header-login">
        <RiTodoLine></RiTodoLine>
        <p>Caio`s TD List</p>
      </header>
      <div className="login-container">
        <div className="login-content">
          <p className="login-title">Login</p>
          <p className="login-info">Type your e-mail and password below to sign-in at To Do List</p>
          <form action="#" className="login-form">
            <input type="text" className="form-input" placeholder="E-mail"/>
            <input type="password" className="form-input" placeholder="Password"/>
          </form>
          <button type="submit" className="signin-button">Sign in</button>
        </div>
      </div>
    </div>
  )
}

export default Login;