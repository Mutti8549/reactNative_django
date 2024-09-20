import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "./Config";

const BookScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [librarian, setLibrarian] = useState("");

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

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = await getToken(); // Retrieve the token
        const response = await axios.get(`${Config.API_URL}/book/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        });
        setBooks(response.data); // Store the fetched books data
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load book details");
      }
    };

    fetchBooks(); // Call the function to fetch data
  }, []);

  // Delete book by ID
  const handleDelete = async (id) => {
    try {
      const token = await getToken(); // Retrieve the token
      await axios.delete(`${Config.API_URL}/book/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      });
      Alert.alert("Success", "Book deleted successfully");
      setBooks(books.filter((book) => book.id !== id)); // Remove the deleted book from the state
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete book");
    }
  };

  // Save or Update book
  const handleSaveBook = async () => {
    try {
      const token = await getToken(); // Retrieve the token
      const bookData = { title, isbn, author, librarian, publication_date };

      console.log("Sending book data:", bookData); // Log book data

      if (selectedBook) {
        // Update existing book
        await axios.put(
          `${Config.API_URL}/book/${selectedBook.id}/`,
          bookData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Alert.alert("Success", "Book updated successfully");
        setBooks(
          books.map((book) =>
            book.id === selectedBook.id ? { ...book, ...bookData } : book
          )
        );
      } else {
        // Add new book
        const response = await axios.post(
          `${Config.API_URL}/book/`,
          bookData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Alert.alert("Success", "Book added successfully");
        setBooks([...books, response.data]);
      }

      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Error response:", error.response.data); // Log error response
      Alert.alert("Error", "Failed to save book");
    }
  };

  // Open modal to add or edit book
  const openModal = (book = null) => {
    if (book) {
      setSelectedBook(book);
      setTitle(book.title);
      setIsbn(book.isbn);
      setAuthor(book.author);
      setLibrarian(book.librarian);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  // Reset form fields
  const resetForm = () => {
    setSelectedBook(null);
    setTitle("");
    setIsbn("");
    setAuthor("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>+ Add New Book</Text>
      </TouchableOpacity>

      {books.map((book) => (
        <View key={book.id} style={styles.bookContainer}>
          <Text style={styles.label}>Title: {book.title}</Text>
          <Text style={styles.label}>ISBN: {book.isbn}</Text>
          <Text style={styles.label}>Author: {book.author}</Text>
          <Text style={styles.label}>
            Publication Date: {book.publication_date}
          </Text>
          {/* <Text style={styles.label}>Librarian: {book.librarian}</Text> */}

          <View style={styles.actionContainer}>
            <Button
              title="Edit"
              onPress={() => openModal(book)}
              color="#4CAF50"
            />
            <Button
              title="Delete"
              color="red"
              onPress={() => handleDelete(book.id)}
            />
          </View>
        </View>
      ))}

      {/* Modal for Adding/Editing Book */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {selectedBook ? "Edit Book" : "Add New Book"}
          </Text>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="ISBN"
            value={isbn}
            onChangeText={setIsbn}
            style={styles.input}
          />
          <TextInput
            placeholder="Author"
            value={author}
            onChangeText={setAuthor}
            style={styles.input}
          />
          <TextInput
            placeholder="Librarian"
            value={librarian}
            onChangeText={setLibrarian}
            style={styles.input}
          />
          <View style={styles.modalActions}>
            <Button
              title={selectedBook ? "Update Book" : "Save Book"}
              onPress={handleSaveBook}
              color="#007BFF"
            />
            <Button
              title="Cancel"
              color="red"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  bookContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default BookScreen;
