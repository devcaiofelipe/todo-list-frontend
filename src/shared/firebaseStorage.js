import { getStorage } from 'firebase/storage';
import firebaseConfig from '../shared/firebaseConfig';

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebaseConfig);

export default storage;