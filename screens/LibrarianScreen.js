import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from './Config';


const LibrarianScreen = ({ navigation }) => {
  const [librarians, setLibrarians] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    hire_date: '',
    email: '',
  });

  // Retrieve the auth token
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      return token;
    } catch (error) {
      console.error('Error retrieving token', error);
      return null;
    }
  };

  // Fetch all librarians
  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`${Config.API_URL}/librarian/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setLibrarians(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load librarian details');
      }
    };

    fetchLibrarians();
  }, []);

  // Delete librarian by ID
  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      await axios.delete(`${Config.API_URL}/librarian/${id}/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      Alert.alert('Success', 'Librarian deleted successfully');
      setLibrarians(librarians.filter(librarian => librarian.id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete librarian');
    }
  };

  // Handle form submission (Add/Update librarian)
  const handleSubmit = async () => {
    const token = await getToken();

    try {
      if (editMode) {
        // Update librarian
        await axios.put(`${Config.API_URL}/librarian/${selectedLibrarian.id}/`, form, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        Alert.alert('Success', 'Librarian updated successfully');
      } else {
        // Add new librarian
        await axios.post(`${Config.API_URL}/librarian/`, form, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        Alert.alert('Success', 'Librarian added successfully');
      }
      setModalVisible(false);
      setForm({ first_name: '', last_name: '', hire_date: '', email: '' });
      setEditMode(false);
      fetchLibrarians(); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save librarian');
    }
  };

  // Open modal to edit a librarian
  const handleEdit = (librarian) => {
    setSelectedLibrarian(librarian);
    setForm({
      first_name: librarian.first_name,
      last_name: librarian.last_name,
      hire_date: librarian.hire_date,
      email: librarian.email,
    });
    setEditMode(true);
    setModalVisible(true);
  };

  // Open modal to add new librarian
  const handleAdd = () => {
    setSelectedLibrarian(null);
    setForm({ first_name: '', last_name: '', hire_date: '', email: '' });
    setEditMode(false);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {librarians.map((librarian) => (
          <View key={librarian.id} style={styles.librarianContainer}>
            <Text style={styles.label}>First Name: {librarian.first_name}</Text>
            <Text style={styles.label}>Last Name: {librarian.last_name}</Text>
            <Text style={styles.label}>Hire Date: {librarian.hire_date}</Text>
            <Text style={styles.label}>Email: {librarian.email}</Text>
            <View style={styles.buttonRow}>
              <Button
                title="Edit"
                onPress={() => handleEdit(librarian)}
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => handleDelete(librarian.id)}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add New Librarian Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>+ Add Librarian</Text>
      </TouchableOpacity>

      {/* Modal for Add/Edit Librarian */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editMode ? 'Edit Librarian' : 'Add Librarian'}</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={form.first_name}
              onChangeText={(text) => setForm({ ...form, first_name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={form.last_name}
              onChangeText={(text) => setForm({ ...form, last_name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Hire Date"
              value={form.hire_date}
              onChangeText={(text) => setForm({ ...form, hire_date: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
            <View style={styles.buttonRow}>
              <Button title="Save" onPress={handleSubmit} />
              <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
  },
  librarianContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#ff6600',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LibrarianScreen;
