import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function Attendance() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);

  const attendanceRef = collection(db, 'attendance');

  // 📥 Load existing attendance from Firestore
  const fetchAttendance = async () => {
    try {
      const q = query(attendanceRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecords(data);
    } catch (error) {
      Alert.alert("Error loading attendance", error.message);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // 📍 Mark attendance
  const markAttendance = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location required');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const record = {
        userId: auth?.currentUser?.email,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        status: "PRESENT",
        timestamp: new Date().toISOString(),
      };

      // ☁️ Save to Firestore
      const docRef = await addDoc(attendanceRef, record);

      // 🧠 Update UI instantly
      setRecords((prev) => [
        { id: docRef.id, ...record },
        ...prev
      ]);

      Alert.alert("Success", "Attendance marked");

    } catch (error) {
      Alert.alert("Error", error.message);
    }

    setLoading(false);
  };

  return (
    <View style={{
      flex: 1,
      padding: 20,
      backgroundColor: "#fff"
    }}>
      <Text style={{
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
      }}>
        Attendance System
      </Text>

      {/* BUTTON */}
      <TouchableOpacity
        onPress={markAttendance}
        style={{
          backgroundColor: "#01579B",
          padding: 18,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {loading ? "Marking..." : "Mark Attendance"}
        </Text>
      </TouchableOpacity>

      {/* RECORDS */}
      <ScrollView>
        {records.map((item) => (
          <View
            key={item.id}
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              marginBottom: 10,
              backgroundColor: "#f9f9f9"
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#01579B" }}>
              {item.status}
            </Text>

            <Text>📧 {item.userId}</Text>
            <Text>📍 Lat: {item.latitude.toFixed(4)}</Text>
            <Text>📍 Lng: {item.longitude.toFixed(4)}</Text>
            <Text>⏱ Time: {new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}