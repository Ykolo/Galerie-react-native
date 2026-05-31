import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CameraScreen from './src/screens/CameraScreen';
import AllPhotosScreen from './src/screens/AllPhotosScreen';
import FoldersScreen from './src/screens/FoldersScreen';
import PhotoDetailScreen from './src/screens/PhotoDetailScreen';
import FolderViewScreen from './src/screens/FolderViewScreen';
import FolderPhotoDetailScreen from './src/screens/FolderPhotoDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function tabIcon(emoji) {
  return ({ focused }) => (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

// Les 3 ecrans principaux de la maquette, en onglets du bas.
function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: 'Camera', tabBarIcon: tabIcon('📷') }}
      />
      <Tab.Screen
        name="Photos"
        component={AllPhotosScreen}
        options={{ title: 'Toutes les photos', tabBarIcon: tabIcon('🖼️') }}
      />
      <Tab.Screen
        name="Folders"
        component={FoldersScreen}
        options={{ title: 'Dossiers', tabBarIcon: tabIcon('📁') }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="PhotoDetail"
            component={PhotoDetailScreen}
            options={{ title: 'Photo' }}
          />
          <Stack.Screen
            name="FolderView"
            component={FolderViewScreen}
            options={({ route }) => ({ title: route.params.folderName })}
          />
          <Stack.Screen
            name="FolderPhotoDetail"
            component={FolderPhotoDetailScreen}
            options={{ title: 'Photo' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
