import { useLocalSearchParams } from 'expo-router';
import EditEmployeeScreen from '../../src/screens/details/EditEmployeeScreen';

export default function Edit() {
  const { id } = useLocalSearchParams();

  return <EditEmployeeScreen id={id as string} />;
}