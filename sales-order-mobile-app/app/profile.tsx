import LoginScreen from '../src/screens/auth/LoginScreen';
import ProfileScreen from '../src/screens/profile/ProfileScreen';
import { auth } from '../src/services/firebase/config';

export default function Profile() {
  if (!auth.currentUser) {
    return <LoginScreen />;
  }
  return <ProfileScreen />;
}
