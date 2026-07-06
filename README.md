# 🎥 ReelBoost – Real-Time Live Streaming Platform
### 🚀 Version 1.0.1

ReelBoost is a real-time live streaming web platform that enables a **Host (Streamer)** to broadcast live video and interact seamlessly with **multiple Viewers** simultaneously.  
The platform is built using modern web technologies, leveraging **PeerJS (WebRTC)** for low-latency video streaming and **Socket.IO (WebSockets)** for real-time interactions.

---

## 🚀 Features

### 🔴 Live Streaming
- A single **Host (Streamer)** can start and manage a live stream
- Multiple **Viewers** can join and watch the stream in real time
- Low-latency live video powered by **PeerJS (WebRTC)**

---

### 💬 Real-Time Chat
- Viewers can chat with the host during the live stream
- The host can reply instantly to viewers
- Chat messages are synchronized for all participants using **Socket.IO**

---

### ❤️ Likes System
- Viewers can send likes during the live stream
- The host can view:
  - Individual user likes
  - Total live likes count
- Likes update instantly without any page refresh

---

### 👀 Live View Count
- The host can see the current number of active viewers
- Viewer count updates in real time as users join or leave the stream

---

### 🎁 Gifts System
- Viewers can send virtual gifts to the host
- Gifts are delivered instantly during the live stream

---

### 💭 Comments
- Viewers can post comments during the live stream
- Comments appear instantly on the host’s screen

---

### ⛔ Live End Handling
When the host stops the live stream:
- All viewers automatically see a blank screen
- Streaming connections are closed safely
- The live session ends for everyone simultaneously

---


### 👤 Host (Streamer)
- Start and stop live streaming
- Interact with viewers via real-time chat
- Monitor:
  - Total likes count
  - Individual user likes
  - Current live viewers count
- Receive gifts and comments in real time

---

### 👥 Viewer
- Join and watch live streams
- Send likes, comments, and virtual gifts
- Automatically disconnected when the host ends the live stream



## 📌 Key Highlights
- Real-time bi-directional communication
- Scalable multi-viewer live streaming
- Low-latency video delivery
- Instant UI updates without page reload



