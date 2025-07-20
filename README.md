# Traffic Dashboard

A full-stack web application for tracking and managing website traffic statistics using Firebase Authentication and Firestore.

##  Technologies

- **Frontend:** React, Firebase Auth, Axios
- **Backend:** Node.js, Express, Firebase Admin SDK
- **Database:** Firestore (NoSQL)

##  Installation

### 1. Clone the Repository

```bash
https://github.com/ronibrod/traffic-dashboard.git
cd traffic-dashboard
```

### 2. Setup Environment Variables

#### Frontend (.env)

Create a `.env` file in the frontend root:

```
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend (.env)

Create a `.env` file in the `functions/` folder:

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> Note: Ensure the private key is properly escaped with `\n` for each newline.

### 3. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd ../functions
npm install
```

### 4. Run the App

```bash
# Start Backend
cd functions
npm run dev

# Start Frontend
npm run dev
```

## Folder Structure

```
traffic-dashboard/
├── src/         # React frontend
│   ├── firebase.js
│   ├── components/
│   └── ...           
├── functions/        # Express backend
│   ├── firebase/
│   │   └── admin.js
│   ├── middlewares/
│   ├── routes/
│   └── index.js
```

## Authentication

- Users sign in using Firebase Auth.
- The frontend sends a Firebase ID token with each request to the backend.
- The backend verifies the token using Firebase Admin SDK.
