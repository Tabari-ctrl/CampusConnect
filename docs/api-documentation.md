# 📘 API Documentation

# Chat App (React Native + Firebase)

## Overview

This project uses **Firebase Authentication**, **Cloud Firestore**, and **Firebase Storage** instead of a traditional REST API.

The application communicates directly with Firebase services through the Firebase SDK.

---

# Technologies

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Expo SDK
- React Native

---

# Authentication

Authentication is handled using Firebase Authentication.

## Current User

```javascript
auth.currentUser;
```

### Returns

```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string
}
```

---

# Firestore Collections

## chats

Stores chat metadata.

Example:

```json
{
  "participants": [
    "user1@email.com",
    "user2@email.com"
  ],
  "lastMessage": "Hello",
  "updatedAt": Timestamp
}
```

---

## messages

Each chat contains a messages subcollection.

Example path

```
chats/{chatId}/messages/{messageId}
```

Example document

```json
{
  "_id": "message-id",
  "text": "Hello",
  "createdAt": Timestamp,
  "status": "SENT",
  "user": {
    "_id": "user@email.com",
    "name": "John"
  },
  "image": null,
  "video": null,
  "audio": null
}
```

---

# Message Object

| Field     | Type      | Description               |
| --------- | --------- | ------------------------- |
| \_id      | String    | Unique message identifier |
| text      | String    | Message text              |
| image     | String    | Image URL                 |
| video     | String    | Video URL                 |
| audio     | String    | Voice note URL            |
| createdAt | Timestamp | Creation time             |
| status    | String    | Message state             |
| user      | Object    | Sender information        |

---

# Message Status

Possible values

```text
SENDING
SENT
FAILED
READ
```

---

# Storage Structure

Images

```
Firebase Storage

images/
```

Videos

```
Firebase Storage

videos/
```

Voice Notes

```
Firebase Storage

voice/
```

Example generated path

```
voice/1f7c3b91.m4a
```

---

# Service Layer

The application communicates with Firebase through the service layer.

```
services/chatMessageService.js
```

---

# Available Service Methods

## sendChatMessage()

Sends a message to Firestore.

### Parameters

```javascript
sendChatMessage({
  chatId,
  message,
});
```

### Example

```javascript
await sendChatMessage({
  chatId,
  message,
});
```

---

## subscribeToChatMessages()

Creates a realtime Firestore listener.

### Parameters

```javascript
subscribeToChatMessages(chatId, onSuccess, onError);
```

Returns

```
unsubscribe()
```

---

## markChatAsRead()

Marks all unread messages as read.

### Parameters

```javascript
markChatAsRead({
  chatId,
  userEmail,
});
```

---

## loadPendingMessages()

Loads locally stored pending messages.

### Parameters

```javascript
loadPendingMessages(chatId);
```

Returns

```
Array<Message>
```

---

## upsertPendingMessage()

Creates or updates a pending message.

### Parameters

```javascript
upsertPendingMessage(chatId, message);
```

---

## removePendingMessage()

Deletes a pending message.

### Parameters

```javascript
removePendingMessage(chatId, messageId);
```

---

## flushPendingMessages()

Attempts to resend failed or pending messages.

### Parameters

```javascript
flushPendingMessages({
  chatId,
});
```

---

## clearDeliveredPendingMessages()

Removes pending messages that have already reached Firestore.

### Parameters

```javascript
clearDeliveredPendingMessages(chatId, deliveredMessageIds);
```

---

## getChatMetadata()

Retrieves chat metadata.

### Parameters

```javascript
getChatMetadata(chatId);
```

---

## ensureChatSchema()

Ensures Firestore documents contain required fields.

### Parameters

```javascript
ensureChatSchema({
  chatId,
  chatData,
});
```

---

# Media Upload API

Media uploads follow this process.

```
Device File
      │
      ▼
Blob Conversion
      │
      ▼
Firebase Storage
      │
      ▼
Download URL
      │
      ▼
Firestore Message
```

---

## Image Message Example

```json
{
  "text": "",
  "image": "https://firebasestorage.googleapis.com/..."
}
```

---

## Video Message Example

```json
{
  "text": "",
  "video": "https://firebasestorage.googleapis.com/..."
}
```

---

## Voice Message Example

```json
{
  "text": "",
  "audio": "https://firebasestorage.googleapis.com/..."
}
```

---

# Offline Synchronization

When the device is offline:

```
Send Message
      │
      ▼
Local Queue
      │
      ▼
Pending Storage
```

When internet returns

```
Pending Queue
      │
      ▼
Firestore Upload
      │
      ▼
Status Update
```

---

# Error Handling

Possible errors include

| Error                   | Cause                |
| ----------------------- | -------------------- |
| Permission denied       | Firebase rules       |
| Upload failed           | Network interruption |
| Authentication required | User signed out      |
| Firestore unavailable   | Internet connection  |

---

# Security Considerations

Current implementation assumes:

- Authenticated users only
- Firebase Security Rules enabled
- Storage Rules configured
- Firestore Rules configured

Recommended improvements:

- End-to-end encryption
- Token validation
- Upload size limits
- Rate limiting
- Media compression

---

# API Flow Summary

```
User Action
      │
      ▼
Chat Screen
      │
      ▼
chatMessageService
      │
      ▼
Firebase SDK
      │
      ▼
Firestore / Storage
      │
      ▼
Realtime Listener
      │
      ▼
UI Update
```

---

# Notes

This project does not expose a traditional REST or GraphQL API. Instead, it relies on Firebase's client SDK to perform authenticated real-time operations, making Firestore and Firebase Storage the primary backend interfaces.
