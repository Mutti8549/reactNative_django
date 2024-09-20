import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Config from "./Config";

const MemberScreen = ({ navigation }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newMember, setNewMember] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    membership_date: "",
    address: "",
    image: null,
  });
  const [editMemberId, setEditMemberId] = useState(null); // To track if we are editing a member

  // Retrieve the auth token
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      return token;
    } catch (error) {
      console.error("Error retrieving token", error);
      return null;
    }
  };

  // Fetch all members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`${Config.API_URL}/member/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load member details");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  

  // Add or Update Member
  // Add or Update Member
  const handleSaveMember = async () => {
    try {
      const token = await getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // For file uploads
      };

      // Create formData
      const formData = new FormData();
      formData.append("first_name", newMember.first_name);
      formData.append("last_name", newMember.last_name);
      formData.append("phone_number", newMember.phone_number);
      formData.append("membership_date", newMember.membership_date);
      formData.append("address", newMember.address);

      // Append the image only if available
      if (newMember.image) {
        formData.append("image", {
          uri: newMember.image.uri,
          name: newMember.image.fileName,
          type: newMember.image.type,
        });
      }

      if (editMemberId) {
        // Update existing member
        await axios.put(`${Config.API_URL}/member/${editMemberId}/`, formData, {
          headers,
        });
        Alert.alert("Success", "Member updated successfully");
      } else {
        // Create new member
        await axios.post(`${Config.API_URL}/member/`, formData, { headers });
        Alert.alert("Success", "Member created successfully");
      }

      // Clear the form and close the modal
      setIsModalVisible(false);
      setNewMember({
        first_name: "",
        last_name: "",
        phone_number: "",
        membership_date: "",
        address: "",
        image: null,
      });

    
      
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save member");
    }
  };

  // Delete member by ID
  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      await axios.delete(`${Config.API_URL}/member/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("Success", "Member deleted successfully");
      setMembers(members.filter((member) => member.id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete member");
    }
  };

  // Open modal for editing member
  const handleEdit = (member) => {
    setNewMember(member);
    setEditMemberId(member.id);
    setIsModalVisible(true);
  };

  // Open modal for creating a new member
  const openCreateModal = () => {
    setNewMember({
      first_name: "",
      last_name: "",
      phone_number: "",
      membership_date: "",
      image: null,
    });
    setEditMemberId(null);
    setIsModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading members...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Button to add a new member */}
      <Button title="Add New Member" onPress={openCreateModal} />

      {members.length > 0 ? (
        members.map((member) => (
          <View key={member.id} style={styles.memberContainer}>
            {member.image ? (
              <Image
                source={{ uri: `${Config.API_URL}/${member.image}` }}
                style={styles.memberImage}
                onError={() => console.log("Failed to load image")}
              />
            ) : (
              <Image
                source={require("../assets/icon.png")}
                style={styles.memberImage}
              />
            )}
            <Text style={styles.label}>First Name: {member.first_name}</Text>
            <Text style={styles.label}>Last Name: {member.last_name}</Text>
            <Text style={styles.label}>
              Membership Date: {member.membership_date}
            </Text>
            <Text style={styles.label}>
              Phone number: {member.phone_number}
            </Text>

            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => handleEdit(member)} />
              <Button
                title="Delete"
                color="red"
                onPress={() => handleDelete(member.id)}
              />
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No members found</Text>
      )}

      {/* Modal for Add/Update Member */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMemberId ? "Update Member" : "Add New Member"}
            </Text>
            <TextInput
              placeholder="First Name"
              value={newMember.first_name}
              onChangeText={(text) =>
                setNewMember({ ...newMember, first_name: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Last Name"
              value={newMember.last_name}
              onChangeText={(text) =>
                setNewMember({ ...newMember, last_name: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Phone Number"
              value={newMember.phone_number}
              onChangeText={(text) =>
                setNewMember({ ...newMember, phone_number: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Membership Date (YYYY-MM-DD)"
              value={newMember.membership_date}
              onChangeText={(text) =>
                setNewMember({ ...newMember, membership_date: text })
              }
              style={styles.input}
            />

            <View style={styles.buttonContainer}>
              <Button
                title={editMemberId ? "Update Member" : "Add Member"}
                onPress={handleSaveMember}
              />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setIsModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
  },
  memberContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  memberImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#333",
  },
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default MemberScreen;

