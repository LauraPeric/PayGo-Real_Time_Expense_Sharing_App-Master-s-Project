import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3157D5',
        tabBarInactiveTintColor: '#9298A8',
        tabBarStyle: {
          height: 70 + (insets.bottom > 0 ? insets.bottom : 15),
          backgroundColor: '#FFFFFF',
          borderTopColor: '#ECEEF3',
          paddingTop: -2,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '800',
        },
      }}
    >
      <Tab.Screen
        name="Putovanja"
        component={HomeScreen}
        options={{ tabBarIcon: () => null }}
      />

      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{ tabBarIcon: () => null }}
      />

      <Tab.Screen
        name="Obavijesti"
        component={NotificationsScreen}
        options={{ tabBarIcon: () => null }}
      />

     
    </Tab.Navigator>
  );
}