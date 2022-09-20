import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
const HomeScreen = ({user, navigation}) => {
  const [chats, setChats] = useState(null);
  const getAllActiveChats = async () => {
    const querySnap = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const allUsers = querySnap.docs.map(docSnap => docSnap.data());
    setChats(allUsers);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getAllActiveChats();
    }
  }, [isFocused]);

  const RenderCard = ({item}) => {
    console.log(item.email.length, 'email');
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Chat', {
            name: item.name,
            uid: item.uid,
            status: 'Hello',
            avatar: item.pic,
            isGroupChat: item.email.length > 1 ? true : false,
            //   typeof item.status == 'string'
            //     ? item.status
            //     : item.status.toDate().toString(),
          })
        }>
        <View style={styles.mycard}>
          <Image source={{uri: item.pic}} style={styles.img} />
          <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={chats}
        renderItem={({item}) => {
          return <RenderCard item={item} />;
        }}
        keyExtractor={item => item.uid}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('GroupChat')}
        style={{
          alignItems: 'flex-end',
          flex: 1,
          justifyContent: 'flex-end',
          margin: 10,
          padding: 10,
        }}>
        <Text style={{color: 'red', fontSize: 18, fontWeight: 'bold'}}>
          New Group Chat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  img: {width: 60, height: 60, borderRadius: 30, backgroundColor: 'green'},
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
  mycard: {
    flexDirection: 'row',
    margin: 3,
    padding: 4,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
});
