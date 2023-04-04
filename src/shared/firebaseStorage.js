import { getStorage } from 'firebase/storage';
import app from '../shared/firebase'

const storage = getStorage(app);

export default storage;