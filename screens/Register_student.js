import { View, Text, StyleSheet, TextInput, Alert, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterStudent = ({ route }) => {
  const [studentData, setStudentData] = useState({
    firstname: "",
    lastname: "",
    admissiondate: "",
    program: "",
    address: "",
    image: null, // Add image field
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (route.params?.student) {
      setStudentData(route.params.student);
      setIsEdit(true);
    }
  }, [route.params]);

  const handleChange = (key, value) => {
    setStudentData(prev => ({ ...prev, [key]: value }));
  };

  // Handle image selection
  const handleImageSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Permission to access camera roll is required!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      setStudentData(prev => ({
        ...prev,
        image: result.assets[0].uri, // Directly use URI
      }));
    } else {
      console.log("No image selected");
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      return token;
    } catch (error) {
      console.error('Error retrieving token', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const url = isEdit
      ? `${Config.API_URL}/student/update/${studentData.id}/`
      : `${Config.API_URL}/student/`;

    const method = isEdit ? "PUT" : "POST";

    // Prepare FormData for file and text data
    const formData = new FormData();
    formData.append("firstname", studentData.firstname);
    formData.append("lastname", studentData.lastname);
    formData.append("admissiondate", studentData.admissiondate);
    formData.append("program", studentData.program);
    formData.append("address", studentData.address);

    // Append image data if available
    if (studentData.image) {
      formData.append("image", {
        uri: studentData.image,
        type: 'image/jpeg',
        name: studentData.image.split('/').pop(),
      });
    }

    try {
      const token = await getToken(); // Retrieve the token

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`, // Add Authorization header
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      await response.json();
      Alert.alert(isEdit ? "Student updated!" : "Student registered!");
      setStudentData({
        firstname: "",
        lastname: "",
        admissiondate: "",
        program: "",
        address: "",
        image: null,
      });
      setIsEdit(false);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {["firstname", "lastname", "program", "address", "admissiondate"].map(field => (
        <TextInput
          key={field}
          placeholder={field.replace(/^\w/, c => c.toUpperCase())}
          value={studentData[field]}
          onChangeText={value => handleChange(field, value)}
          style={styles.input}
        />
      ))}

      {/* Display the selected image */}
      {studentData.image && (
        <Image
          source={{ uri: studentData.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={handleImageSelect}>
        <Text style={styles.uploadButtonText}>Select Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEdit ? "Update" : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterStudent;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  input: {
    height: 50,
    width: 300,
    borderColor: "#FF9800",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFF3E0",
    marginVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  uploadButtonText: {
    color: "white",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
