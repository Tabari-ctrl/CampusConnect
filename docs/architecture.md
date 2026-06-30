# 🏗️ Architecture Documentation

# Chat App (React Native + Firebase)

## Overview

This application is a real-time messaging system built with **React Native (Expo)** and **Firebase**. The architecture focuses on responsive user experience, offline resilience, and reliable media delivery through optimistic updates and asynchronous synchronization.

The system separates responsibilities into independent layers for UI, business logic, synchronization, and cloud storage.

---

# High-Level Architecture

```text
                User
                  │
                  ▼
        React Native UI Layer
                  │
                  ▼
         Chat Screen (Chat.js)
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 Message Processing     Media Processing
        │                   │
        ▼                   ▼
 chatMessageService    Firebase Storage
        │                   │
        └─────────┬─────────┘
                  ▼
           Cloud Firestore
                  │
                  ▼
        Real-Time Listeners
                  │
                  ▼
              UI Updates
```

---

# Architectural Layers

## 1. Presentation Layer

Responsible for displaying information and handling user interaction.

Components include:

- Chat screen
- GiftedChat UI
- Emoji picker
- Image picker
- Voice recorder
- Media previews
- Message status indicators

Responsibilities:

- Render messages
- Handle user input
- Display upload progress
- Display read receipts
- Show failed message states

---

## 2. Business Logic Layer

Located primarily inside:

```
Chat.js
```

Responsibilities include:

- Sending messages
- Recording voice notes
- Uploading media
- Updating UI optimistically
- Managing recording timers
- Handling retry logic
- Coordinating synchronization

---

## 3. Service Layer

Located in:

```
services/chatMessageService.js
```

This layer abstracts Firebase from the UI.

Responsibilities:

- Sending messages
- Receiving messages
- Marking chats as read
- Queue synchronization
- Offline persistence
- Firestore subscriptions

The UI never communicates directly with Firestore.

---

## 4. Utility Layer

Located in:

```
utils/chat.js
```

Responsibilities:

- Message normalization
- Message merging
- Status handling
- Duplicate removal
- Consistent data formatting

---

## 5. Cloud Layer

Firebase provides three major services.

### Authentication

Identifies users.

Used for:

- Sender identity
- Ownership
- Read receipts

---

### Cloud Firestore

Stores:

- Chats
- Messages
- Read status
- Metadata

Firestore listeners provide instant updates to every connected client.

---

### Firebase Storage

Stores:

- Images
- Videos
- Voice recordings

The application uploads media first, then stores only the download URL inside Firestore.

---

# Message Lifecycle

## Text Message

```text
User Types Message
        │
        ▼
Optimistic UI Update
        │
        ▼
Pending Queue
        │
        ▼
Firestore Upload
        │
        ▼
Server Confirmation
        │
        ▼
Status Updated
```

Possible states:

```
SENDING

↓

SENT

↓

READ
```

If upload fails:

```
FAILED

↓

Retry

↓

SENDING
```

---

# Media Upload Pipeline

```text
User selects media
        │
        ▼
Convert file into Blob
        │
        ▼
Upload to Firebase Storage
        │
        ▼
Receive Download URL
        │
        ▼
Create Firestore Message
        │
        ▼
Other users receive media instantly
```

This prevents storing large files directly inside Firestore.

---

# Voice Note Pipeline

```text
Hold microphone
        │
        ▼
Audio Recording
        │
        ▼
Release microphone
        │
        ▼
Recording stops
        │
        ▼
Upload to Firebase Storage
        │
        ▼
Download URL generated
        │
        ▼
Audio message sent
```

Maximum recording duration:

```
30 seconds
```

---

# Offline Strategy

The application is designed to tolerate network interruptions.

Workflow:

```text
No Internet
      │
      ▼
Store Pending Message
      │
      ▼
UI Still Updates
      │
      ▼
Network Restored
      │
      ▼
Automatic Synchronization
      │
      ▼
Pending Queue Cleared
```

Benefits:

- No lost messages
- Better user experience
- Reliable synchronization

---

# Message Status System

Each outgoing message maintains a lifecycle.

```
SENDING
```

The message exists locally.

↓

```
SENT
```

Firestore accepted the message.

↓

```
READ
```

Recipient has opened the conversation.

↓

```
FAILED
```

Upload failed.

The user can retry manually.

---

# Component Responsibilities

## Chat.js

Responsible for:

- Chat interface
- Sending messages
- Uploading media
- Voice recording
- Emoji handling
- Retry logic
- Status updates

---

## chatMessageService.js

Responsible for:

- Firestore communication
- Read receipts
- Synchronization
- Offline queue
- Message subscriptions

---

## chat.js

Responsible for:

- Message normalization
- Merge algorithm
- Status constants
- Data formatting

---

## MessageVideo.js

Responsible for:

- Rendering video messages
- Video playback UI

---

# Design Principles

The architecture follows several software engineering principles.

## Separation of Concerns

UI does not directly manipulate Firebase.

---

## Single Responsibility

Each module performs one primary task.

---

## Optimistic Updates

The interface updates immediately without waiting for the network.

---

## Offline First

Messages are preserved even without connectivity.

---

## Cloud Storage Separation

Large media files are stored in Firebase Storage while Firestore only stores references.

---

# Future Improvements

Potential architectural enhancements include:

- End-to-end encryption
- Typing indicators
- Presence system
- Voice playback component
- Push notifications
- Group chats
- Media compression
- Pagination
- Background uploads
- Local database caching (SQLite/Realm)

---

# Summary

The application combines a responsive user interface with Firebase's real-time infrastructure to create a messaging system that remains usable under unreliable network conditions.

Its architecture emphasizes:

- Real-time synchronization
- Offline resilience
- Optimistic UI updates
- Modular design
- Scalable service separation
- Efficient media handling

This design provides a solid foundation for expanding into a production-ready messaging platform.
