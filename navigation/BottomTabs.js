import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import StudentRecord from "../screens/Student_record";
import RegisterStudent from "../screens/Register_student";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="home" size={34} color="orange" />
          ),
        }}
      />
      <Tab.Screen
        name="StudentRecord"
        component={StudentRecord}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather name="book-open" size={34} color="orange" />
          ),
        }}
      />
      <Tab.Screen
        name="Register Student"
        component={RegisterStudent}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="addusergroup" size={24} color="orange" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
