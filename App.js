import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import {Text, TouchableOpacity, View} from 'react-native';

const Stack = createStackNavigator();
const App = () => {
  const [user, setUser] = useState('');
  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) setUser(userExist);
      else setUser('');
    });
    return () => {
      unregister();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTintColor: 'green'}}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              //component={HomeScreen}
              options={{
                headerRight: () => {
                  return (
                    <TouchableOpacity onPress={() => auth().signOut()}>
                      <Text>Logout</Text>
                    </TouchableOpacity>
                  );
                },
              }}>
              {props => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="Chat"
              options={({route}) => ({
                title: (
                  <View>
                    <Text>{route.params.name}</Text>
                    <Text>{route.params.status}</Text>
                  </View>
                ),
              })}>
              {props => <ChatScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
