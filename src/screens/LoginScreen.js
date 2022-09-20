import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState('');

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  const onLogin = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        alert('Plase fill in all the details');
        setLoading(false);
        return;
      }
      const result = await auth().signInWithEmailAndPassword(email, password);
      if (result) {
        navigation.navigate('Home');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('something went wrong');
      console.error(error);
    }
  };
  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="position">
        <View style={styles.signUpContainer}>
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Email"
            value={email}
            onChangeText={value => setEmail(value)}
          />
          <Text style={styles.labelText}>Password</Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Enter Password"
            value={password}
            onChangeText={value => setPassword(value)}
            secureTextEntry={true}
          />

          <TouchableOpacity onPress={onLogin}>
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text>Don't have an account? SignUp</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  signUpContainer: {
    marginHorizontal: 20,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 7,
    color: 'black',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
});
