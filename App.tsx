import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import StreamScreen from './src/screens/StreamScreen';
import ChatScreen from './src/screens/ChatScreen';
import CameraScreen from './src/screens/CameraScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';

// Store & Services
import { useTwitchStore } from './src/stores/twitchStore';
import { twitchService } from './src/services/twitchService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom Tab Navigator - Hauptnavigation
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Stream') iconName = 'play-circle-filled';
          else if (route.name === 'Chat') iconName = 'message';
          else if (route.name === 'Camera') iconName = 'videocam';
          else if (route.name === 'Settings') iconName = 'settings';

          return (
            <MaterialIcons
              name={iconName}
              size={size}
              color={color}
              style={{ marginBottom: -3 }}
            />
          );
        },
        tabBarActiveTintColor: '#9146ff',
        tabBarInactiveTintColor: '#53535f',
        tabBarStyle: {
          backgroundColor: '#0e0e10',
          borderTopColor: '#1a1a1e',
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: '#0e0e10',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'DashTwo' }}
      />
      <Tab.Screen
        name="Stream"
        component={StreamScreen}
        options={{ title: 'Stream' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: 'Kameras' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Einstellungen' }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 */
export default function App() {
  const { isAuthenticated, setToken, setUserData } = useTwitchStore();

  // Auth-Check beim App-Start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = await twitchService.getStoredToken();
        if (savedToken) {
          setToken(savedToken);
          const userData = await twitchService.getUserData(savedToken);
          setUserData(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animationEnabled: true,
            }}
          >
            {!isAuthenticated ? (
              <Stack.Screen name="Login" component={LoginScreen} />
            ) : (
              <Stack.Screen name="Main" component={MainTabs} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#0e0e10" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
