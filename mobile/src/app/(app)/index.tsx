import { Redirect } from 'expo-router';

// Redirect to game as the default tab
export default function Index() {
  return <Redirect href="/game" />;
}
