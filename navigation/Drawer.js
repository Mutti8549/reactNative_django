import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabs from "./BottomTabs";
import BookScreen from "../screens/BookScreen";
import LibrarianScreen from "../screens/LibrarianScreen";
import MemberScreen from "../screens/MemberScreen";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../screens/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    // Optional: Navigate to the login screen after logout
  };

  // Custom drawer content to include the drawer items and logout button
  const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.headerText}>My Orange App</Text>
      </View>
      <DrawerItemList {...props} />
      {/* Logout Button */}
      <DrawerItem
        label="Logout"
        labelStyle={{ color: "#ff6600" }} // Ensure Logout text is orange for visibility
        onPress={handleLogout}
        icon={({ color, size }) => (
          <Icon name="log-out-outline" color="#ff6600" size={size} /> // Make the icon orange
        )}
      />
    </DrawerContentScrollView>
  );

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ff6600", // Orange header background
        },
        headerTintColor: "#fff", // White header text
        drawerActiveTintColor: "#ff6600", // Active drawer item color
        drawerInactiveTintColor: "#fff", // Inactive drawer item color
        drawerStyle: {
          backgroundColor: "#333", // Dark background for the drawer
        },
        drawerLabelStyle: {
          fontSize: 16, // Label text size
        },
      }}
    >
      <Drawer.Screen
        name="Orange App"
        component={BottomTabs}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Books"
        component={BookScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Librarian"
        component={LibrarianScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Member"
        component={MemberScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    height: 150,
    backgroundColor: "#ff6600", // Orange background for header
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
