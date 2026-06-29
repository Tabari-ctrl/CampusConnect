📱 Chat App (React Native + Firebase)
A real-time chat application built with React Native (Expo) and Firebase, supporting text messages, images, videos, emoji reactions, and voice notes with offline-safe messaging.
✨ Features
💬 Real-time messaging using Firestore
🟢 Online/offline message sync
📷 Image & video sharing (camera + gallery)
🎙️ Voice notes (max 30 seconds)
😊 Emoji picker support
📦 Optimistic UI (messages appear instantly)
🔁 Retry failed messages
⏳ Message status tracking (sending / sent / failed / read)
🔔 Read receipts system
💾 Pending message persistence (offline support)
☁️ Firebase Storage media uploads
🧠 Tech Stack
React Native (Expo)
Firebase Authentication
Cloud Firestore
Firebase Storage
Gifted Chat (UI layer)
Expo AV (audio recording)
Expo Image Picker
🏗️ Architecture Overview
The app is structured around a real-time chat pipeline:
User Input
↓
Optimistic Message (UI instantly updates)
↓
Firestore Sync (sendChatMessage)
↓
Pending Queue (offline-safe storage)
↓
Message Status Update (SENT / FAILED / READ)
Media flow:
Image/Video/Audio
↓
Temporary Blob
↓
Firebase Storage Upload
↓
Download URL
↓
Message sent via Firestore
🎤 Voice Notes (New Feature)
Hold mic to start recording
Release to stop recording
Auto-stop at 30 seconds
Uploaded to Firebase Storage
Stored as:
audio: "download_url_here"
📁 Project Structure
/components
MessageVideo.js

/services
chatMessageService.js

/utils
chat.js

/config
firebase.js
constants.js

/screens
Chat.js
🔥 Firebase Setup
Create a .env file:
EXPO_PUBLIC_API_KEY=your_key
EXPO_PUBLIC_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_PROJECT_ID=your_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_APP_ID=your_app_id
🚀 Run Project
npm install
npx expo start
🧪 Key Logic Highlights
✔ Optimistic Messaging
Messages appear instantly before server confirmation.
✔ Offline Support
Pending messages are stored locally and synced when online.
✔ Message States
SENDING → SENT → READ
↘ FAILED (retry supported)
✔ Media Upload Pipeline
All media is uploaded to Firebase Storage before sending message metadata.
⚠️ Known Limitations
No encryption (messages are not end-to-end encrypted)
Voice playback UI not yet implemented
Requires stable Firebase configuration
Large media depends on network stability
🧭 Future Improvements
🔊 Voice message playback UI
🟣 Typing indicators
🟢 Online presence system
💬 Message reactions (like WhatsApp/Telegram)
🔐 End-to-end encryption
☁️ Better offline queue sync
🧑‍💻 Author
Built with persistence, debugging pain, and too many Firebase errors.
💭 Final Note
This project is not just a chat app.
It’s:
realtime sync logic
offline resilience
media pipeline engineering
UI state management under pressure
Basically: a real-world messaging system prototype.📱 Chat App (React Native + Firebase)
A real-time chat application built with React Native (Expo) and Firebase, supporting text messages, images, videos, emoji reactions, and voice notes with offline-safe messaging.
✨ Features
💬 Real-time messaging using Firestore
🟢 Online/offline message sync
📷 Image & video sharing (camera + gallery)
🎙️ Voice notes (max 30 seconds)
😊 Emoji picker support
📦 Optimistic UI (messages appear instantly)
🔁 Retry failed messages
⏳ Message status tracking (sending / sent / failed / read)
🔔 Read receipts system
💾 Pending message persistence (offline support)
☁️ Firebase Storage media uploads
🧠 Tech Stack
React Native (Expo)
Firebase Authentication
Cloud Firestore
Firebase Storage
Gifted Chat (UI layer)
Expo AV (audio recording)
Expo Image Picker
🏗️ Architecture Overview
The app is structured around a real-time chat pipeline:
User Input
↓
Optimistic Message (UI instantly updates)
↓
Firestore Sync (sendChatMessage)
↓
Pending Queue (offline-safe storage)
↓
Message Status Update (SENT / FAILED / READ)
Media flow:
Image/Video/Audio
↓
Temporary Blob
↓
Firebase Storage Upload
↓
Download URL
↓
Message sent via Firestore
🎤 Voice Notes (New Feature)
Hold mic to start recording
Release to stop recording
Auto-stop at 30 seconds
Uploaded to Firebase Storage
Stored as:
audio: "download_url_here"
📁 Project Structure
/components
MessageVideo.js

/services
chatMessageService.js

/utils
chat.js

/config
firebase.js
constants.js

/screens
Chat.js
🔥 Firebase Setup
Create a .env file:
EXPO_PUBLIC_API_KEY=your_key
EXPO_PUBLIC_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_PROJECT_ID=your_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_APP_ID=your_app_id
🚀 Run Project
npm install
npx expo start
🧪 Key Logic Highlights
✔ Optimistic Messaging
Messages appear instantly before server confirmation.
✔ Offline Support
Pending messages are stored locally and synced when online.
✔ Message States
SENDING → SENT → READ
↘ FAILED (retry supported)
✔ Media Upload Pipeline
All media is uploaded to Firebase Storage before sending message metadata.
⚠️ Known Limitations
No encryption (messages are not end-to-end encrypted)
Voice playback UI not yet implemented
Requires stable Firebase configuration
Large media depends on network stability
🧭 Future Improvements
🔊 Voice message playback UI
🟣 Typing indicators
🟢 Online presence system
💬 Message reactions (like WhatsApp/Telegram)
🔐 End-to-end encryption
☁️ Better offline queue sync
🧑‍💻 Author
Built with persistence, debugging pain, and too many Firebase errors.
💭 Final Note
This project is not just a chat app.
It’s:
realtime sync logic
offline resilience
media pipeline engineering
UI state management under pressure
Basically: a real-world messaging system prototype.
