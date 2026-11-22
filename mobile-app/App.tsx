import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TripsProvider } from './src/context/TripsContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import TripDetailsScreen from './src/screens/TripDetailsScreen';
import AddMembersScreen from './src/screens/AddMembersScreen';
import GroupSettingsScreen from './src/screens/GroupSettingsScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user } = useAuth();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // splash screen
  if (isSplashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashLogo}>PayGo</Text>
      </View>
    );
  }

  // reg/login korisnika, ako vec prijavljen onda tab nav
  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="AddMembers" component={AddMembersScreen} />
          <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
          <Stack.Screen name="GroupSettings" component={GroupSettingsScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TripsProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </TripsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#3157D5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});