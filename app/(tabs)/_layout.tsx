import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log(
        'Checking auth state:',
        session ? 'Has session' : 'No session'
      );
      if (!session) {
        console.log('No session found, redirecting to login...');
        router.replace('/login');
      }
    };

    checkAuth();
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
