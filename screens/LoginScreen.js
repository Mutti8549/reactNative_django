// LoginScreen.js
import React, { useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext'; // Adjust path if necessary
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from './Config';


const LoginScreen = ({ navigation }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = React.useState('admin');
  const [password, setPassword] = React.useState('admin');

  const handleLogin = async () => {

    try {
      const response = await axios.post(`${Config.API_URL}/api/token/`, {
        username,
        password,
      });
      const { access, refresh } = response.data;

      console.log(response.data);

      await AsyncStorage.setItem('jwtToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      setIsAuthenticated(true);
      navigation.navigate('Drawer'); // Navigate to the main app
    } catch (error) {
      Alert.alert('Login Error', 'Invalid credentials or server error');
    }
  };

  return (
    <View style={styles.container}>
      
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default LoginScreen;
