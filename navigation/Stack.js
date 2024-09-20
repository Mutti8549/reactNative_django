import React, { useContext } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext, AuthProvider } from "../screens/AuthContext";
import Home from "../screens/Home";
import BottomTabs from "./BottomTabs";
import MyDrawer from "./Drawer";
import Settings from "../screens/Settings";
import LibrarianScreen from "../screens/LibrarianScreen";
import BookScreen from "../screens/BookScreen";
import MemberScreen from "../screens/MemberScreen";
import LoginScreen from "../screens/LoginScreen";
import StudentRecord from '../screens/Student_record';
import RegisterStudent from '../screens/Register_student';


const Stack = createNativeStackNavigator();

function MyStack() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainHome" component={Home} />
            <Stack.Screen name="Drawer" component={MyDrawer} />
            <Stack.Screen name="StudentRecord" component={StudentRecord} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="RegisterStudent" component={RegisterStudent} />
            <Stack.Screen name="Librarian" component={LibrarianScreen} />
            <Stack.Screen name="Book" component={BookScreen} />
            <Stack.Screen name="Member" component={MemberScreen} />
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => (
  <AuthProvider>
    <MyStack />
  </AuthProvider>
);
