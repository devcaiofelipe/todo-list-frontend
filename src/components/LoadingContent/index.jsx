import './styles.css';
import { RiTodoLine } from 'react-icons/ri';

export const LoadingContent = () => {
  return (
    <div className="loading-profile">
      <div className="loading-profile-content">
        <RiTodoLine className="loading-icon"/>
        <h1>Mind Organizer</h1>
      </div>
    </div>
  )
}