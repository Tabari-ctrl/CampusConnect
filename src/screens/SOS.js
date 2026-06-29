import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import * as Location from 'expo-location';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function SOS() {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const sosRef = collection(db, 'sos_alerts');

  // 🔥 Send SOS
  const sendSOS = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location is required for SOS');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const now = new Date();
      const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h

      const alert = {
        userId: auth?.currentUser?.email,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        createdAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        active: true,
      };

      const docRef = await addDoc(sosRef, alert);

      setAlerts((prev) => [
        { id: docRef.id, ...alert },
        ...prev
      ]);

      Alert.alert(
        'SOS SENT 🚨',
        'Emergency alert sent with 24h validity'
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    }

    setLoading(false);
  };

  // 🔥 Load SOS alerts
  const loadSOS = async () => {
    try {
      const q = query(sosRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const now = new Date();

      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => new Date(item.expiresAt) > now); // 👈 EXPIRY FILTER

      setAlerts(data);

    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadSOS();
  }, []);

  return (
    <View style={{
      flex: 1,
      padding: 20,
      backgroundColor: '#fff'
    }}>

      <Text style={{
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
      }}>
        Emergency SOS
      </Text>

      {/* SOS BUTTON */}
      <TouchableOpacity
        onPress={sendSOS}
        style={{
          backgroundColor: 'red',
          padding: 25,
          borderRadius: 100,
          alignSelf: 'center',
          marginBottom: 20
        }}
      >
        <Text style={{
          color: 'white',
          fontWeight: 'bold'
        }}>
          {loading ? 'Sending...' : 'SOS'}
        </Text>
      </TouchableOpacity>

      {/* ACTIVE ALERTS */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Active Alerts
      </Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            padding: 12,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            marginBottom: 10
          }}>
            <Text style={{ fontWeight: 'bold', color: 'red' }}>
              🚨 SOS ACTIVE
            </Text>

            <Text>📧 {item.userId}</Text>
            <Text>📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
            <Text>⏱ Expires: {new Date(item.expiresAt).toLocaleString()}</Text>
          </View>
        )}
      />

    </View>
  );
}