import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import React from 'react';

const Home = () => {
  const theme = useColorScheme();  // Detect dark or light mode

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <Text style={theme === 'dark' ? styles.darkText : styles.lightText}>This is Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBackground: {
    backgroundColor: 'black',
  },
  lightBackground: {
    backgroundColor: 'white',
  },
  darkText: {
    color: 'white',
    fontSize: 18,
  },
  lightText: {
    color: 'black',
    fontSize: 18,
  },
});
