import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function LostFound() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = collection(db, 'lost_found');

  // 📥 Load items
  const loadItems = async () => {
    try {
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // 📤 Add item
  const addItem = async () => {
    if (!itemName || !description || !location) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const newItem = {
        userId: auth?.currentUser?.email,
        itemName,
        description,
        location,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(ref, newItem);

      setItems((prev) => [
        { id: docRef.id, ...newItem },
        ...prev
      ]);

      setItemName('');
      setDescription('');
      setLocation('');

      Alert.alert('Success', 'Item reported');

    } catch (error) {
      Alert.alert('Error', error.message);
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>
        Lost & Found
      </Text>

      {/* INPUTS */}
      <TextInput
        placeholder="Item name"
        value={itemName}
        onChangeText={setItemName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Location lost"
        value={location}
        onChangeText={setLocation}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 }}
      />

      {/* BUTTON */}
      <TouchableOpacity
        onPress={addItem}
        style={{
          backgroundColor: '#1A237E',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {loading ? 'Posting...' : 'Report Item'}
        </Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            padding: 12,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            marginBottom: 10
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {item.itemName}
            </Text>

            <Text>📝 {item.description}</Text>
            <Text>📍 {item.location}</Text>
            <Text>👤 {item.userId}</Text>
          </View>
        )}
      />

    </View>
  );
}