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
import React, {useState, useId} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export default function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  const userSignup = async () => {
    try {
      setLoading(true);
      if (!email || !password || !name || !image) {
        alert('Plase fill in all the details');
        setLoading(false);
        return;
      }
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      firestore()
        .collection('users')
        .doc(result.user.uid)
        .set({
          name,
          email: result.user.email,
          uid: result.user.uid,
          pic: image,
          users: [{userId: '', userName: ''}],
          groupName: '',
        });
      navigation.navigate('Home');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('something went wrong');
      console.error(error);
    }
  };
  const openImageLibrary = () => {
    setLoading(true);
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      const uploadTask = storage()
        .ref()
        .child(`/userProfile/${Date.now()}`)
        .putFile(image.path);

      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100) alert('image uploaded');
          setLoading(false);
        },
        error => {
          setLoading(false);
          alert('error uploading image');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            setImage(downloadURL);
            setLoading(false);
          });
        },
      );
    });
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="position">
        <View style={styles.signUpContainer}>
          <Text style={styles.labelText}>Name</Text>
          <TextInput
            style={styles.inputContainer}
            value={name}
            onChangeText={value => setName(value)}
            placeholder="Name"
          />
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
          <Text style={styles.labelText}>Image</Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
              padding: 10,
              borderRadius: 10,
              marginBottom: 30,
            }}
            onPress={openImageLibrary}>
            <Text style={{color: 'white', textAlign: 'center'}}>
              Upload Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{backgroundColor: 'black', padding: 10, borderRadius: 10}}
            onPress={userSignup}>
            <Text style={{color: 'white', textAlign: 'center'}}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginVertical: 10}}
            onPress={() => navigation.goBack()}>
            <Text style={{color: 'red', fontSize: 18, fontWeight: 'bold'}}>
              <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
                {' '}
                Already Have an Account ?
              </Text>{' '}
              Sign In
            </Text>
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
