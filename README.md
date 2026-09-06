# 🌐 Public Web Repository — Status Feed v9.0

Welcome to the official repository for **Status Feed v9.0**, a sleek, modern, and real-time dynamic story web application built with a Glassmorphism dark-mode aesthetic and powered by Firebase Firestore.

---

## ✨ Key Features

- 🎨 **Glassmorphism Dark UI**: Built with modern CSS custom properties, backdrop blur filters, and vibrant ambient ambient background glows.
- 📸 **Dynamic Story Types**: Supports Text, Image, and Video status updates with real-time Firestore database synchronization.
- ⚡ **Aesthetic Glassmorphism Loader**: Pre-loads images and video media with a custom Google-inspired animated spinner before triggering progress timers.
- 👁️ **Realtime View Counter**: Tracks story views dynamically using Firebase `increment()` counters.
- 👤 **Custom Avatar Rings**: Displays user profile pictures centered within animated multi-color status rings.
- 🔒 **Admin Control Panel**: Manage content, upload updates, and delete active statuses easily.
- 🚀 **Advanced SEO & Social Sharing**: Pre-configured with Open Graph meta tags, Twitter Cards, JSON-LD Structured Data, and Canonical URLs.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Modern CSS3 (Flexbox/Grid, Glassmorphism, CSS Animations)
- **Scripting**: Native JavaScript (ES6 Modules)
- **Backend / Database**: Firebase Firestore (v10.8.0)
- **Typography**: Google Fonts (*Plus Jakarta Sans*)

---

## 📁 Repository Structure

```text
├── README.md           # Pr1.oject documentation & overview
├── index.html          # Main status feed client application
├── admin.html          # Admin management dashboard interface
├── style.css           # Global stylesheet & Glassmorphism design system
├── app.js              # Core logic for story rendering, preloading & view tracking
├── admin.js            # Admin panel functionality & Firebase CRUD operations
├── firebase-config.js  # Firebase initialized SDK configuration
└── favicon.png         # Site favicon icon

##🚀 Getting Started
1. Clone the repository:
git clone [https://github.com/VexorNull/public.git](https://github.com/VexorNull/public.git)
cd public

2. Configure Firebase:
Ensure firebase-config.js contains your valid Firebase project credentials:

import { initializeApp } from "[https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js)";
import { getFirestore } from "[https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js)";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const db = getFirestore(initializeApp(firebaseConfig));

3. Run Locally:
Open index.html in any modern web browser or serve via a local web server (e.g., VS Code Live Server extension).

##👤 Author & Maintainer
Crafted with precision by Tanveer Hussain
GitHub: @vexornull
