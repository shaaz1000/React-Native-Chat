import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const GroupChatScreen = ({user, navigation}) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [image, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmails] = useState([]);
  const createGroup = async () => {
    await firestore().collection('users').doc(Date.now().toString()).set({
      name: groupName,
      email,
      uid: Date.now().toString(),
      pic: image,
    });

    navigation.goBack();
  };

  const getAllActiveUsers = async () => {
    const querySnap = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const allUsers = querySnap.docs.map(docSnap => docSnap.data());
    let newUsers = allUsers.map(val => {
      return {...val, isSelected: false};
    });
    setAvailableUsers(newUsers);
  };

  const selectUsers = users => {
    let userIndex = availableUsers.findIndex(val => val.uid === users.uid);
    if (userIndex > -1) {
      let newArray = [
        ...availableUsers.slice(0, userIndex),
        {
          ...availableUsers[userIndex],
          isSelected: !availableUsers[userIndex].isSelected,
        },
        ...availableUsers.slice(userIndex + 1),
      ];

      const data = newArray
        .filter(val => val.isSelected === true)
        .map(val => val.email.toString());

      setEmails(data);
      setAvailableUsers(newArray);
    }
  };
  const onImageClick = () => {
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
            setImageUrl(downloadURL);
            setLoading(false);
          });
        },
      );
    });
  };
  useEffect(() => {
    getAllActiveUsers();
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{margin: 10}}>
          <Text>Group Name</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
              padding: 10,
              marginVertical: 10,
            }}
            placeholder="Group Name"
            onChangeText={val => setGroupName(val)}
          />
          <Text>Group Photo</Text>
          <TouchableOpacity
            onPress={onImageClick}
            style={{
              marginVertical: 10,
              backgroundColor: 'blue',
              borderRadius: 10,
              padding: 10,
            }}>
            <Text style={{fontSize: 16, color: 'white', textAlign: 'center'}}>
              Upload Group Pic
            </Text>
          </TouchableOpacity>
          <Text>Group Participants</Text>
          {availableUsers &&
            availableUsers.map((users, index) => {
              return (
                <View
                  key={index.toString()}
                  style={{
                    backgroundColor: users.isSelected ? 'yellow' : 'white',
                    elevation: 5,
                    margin: 10,
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => selectUsers(users)}
                    style={{flexDirection: 'row'}}>
                    <View style={{padding: 10}}>
                      <Image
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          backgroundColor: 'green',
                        }}
                        source={{uri: users.pic}}
                      />
                    </View>
                    <View>
                      <Text>{users.name}</Text>
                      <Text>{users.email}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
      </ScrollView>
      {email.length > 1 && (
        <TouchableOpacity
          onPress={createGroup}
          style={{
            margin: 10,
            backgroundColor: 'black',
            borderRadius: 10,
            padding: 10,
          }}>
          <Text style={{fontSize: 16, color: 'white', textAlign: 'center'}}>
            Create Group
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default GroupChatScreen;

const styles = StyleSheet.create({});
