import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "./Config";

const StudentRecord = () => {
  const [students, setStudents] = useState([]);
  const [asc, setAsc] = useState(true);
  const navigation = useNavigation();

  // Retrieve JWT token from AsyncStorage
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      return token;
    } catch (error) {
      console.error('Error retrieving token', error);
      return null;
    }
  };

  // Refresh the student list
  const refreshList = async () => {
    const token = await getToken();
    if (!token) return;

    fetch(`${Config.API_URL}/student/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => console.error("Error fetching student data: " + error));
  };

  useEffect(() => {
    refreshList(); // Call this function when the component mounts
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshList();
    }, [])
  );

  // Sort students function
  const sortStudents = (key) => {
    const sortedStudents = [...students].sort((a, b) => {
      if (asc) {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setStudents(sortedStudents);
    setAsc(!asc);
  };

  const deleteStudent = async (id) => {
    const token = await getToken();
    if (!token) return;

    Alert.alert("Confirm Delete", "Are you sure you want to delete?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm Delete",
        onPress: () => {
          fetch(`${Config.API_URL}/student/delete/${id}/`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(`Error deleting: ${res.statusText}`);
              }
              Alert.alert("Successfully Deleted");
              refreshList();
            })
            .catch((err) => {
              Alert.alert("Error", err.message);
              console.log(err.message);
            });
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Image
        source={{ uri: `${Config.API_URL}/${item.image}` }}
        style={styles.studentImage}
        resizeMode="cover"
      />
      <Text
        style={styles.headerCell}
        onPress={() =>
          navigation.navigate("RegisterStudent", { student: item })
        }
      >
        {item.id}
      </Text>
      <Text style={styles.tableCell}>
        {item.firstname} {item.lastname}
      </Text>
      <Text style={styles.tableCell}>{item.program}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteStudent(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <TouchableOpacity
          onPress={() => sortStudents("id")}
          style={styles.headerCell}
        >
          <Text>ID {asc ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => sortStudents("firstname")}
          style={styles.headerCell}
        >
          <Text>Name {asc ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => sortStudents("program")}
          style={styles.headerCell}
        >
          <Text>Program {asc ? "▲" : "▼"}</Text>
        </TouchableOpacity>
      </View>

      {/* Table Rows */}
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#FFF3E0",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#FF9800", // Orange border
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#FFB74D", // Darker orange background for header
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    color: "white", // White text for contrast
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#FF9800", // Orange border
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#FFF3E0", // Lighter orange background for rows
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    color: "#333", // Darker text color for readability
  },
  headerCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#FF9800", // Orange border
    backgroundColor: "#FF9800", // Primary orange background for header cells
    color: "white", // White text color for better contrast
  },
  deleteButton: {
    backgroundColor: "#FF5722", // Red-orange color for delete button
    padding: 10,
    borderRadius: 5, // Rounded corners
    marginLeft: 10, // Space between cells and button
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10, // Margin between image and other elements
  },
});

export default StudentRecord;
