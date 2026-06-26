# The Upper Millstone — Recipe App

A recipe management app for **The Upper Millstone** bakery. Bakers select their name from a shared iPad to browse recipes, while admins manage recipes, categories, and bakers through a dashboard. All recipe access is logged for audit purposes.

## Tech Stack

- **React** (Vite)
- **Firebase**: Auth, Firestore, Storage, Hosting
- **Tailwind CSS**

## Setup

### 1. Clone and install

```bash
cd recipe-app
npm install
```

### 2. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Authentication** → Email/Password sign-in method
3. Create a **Firestore Database** (start in test mode, then deploy security rules)
4. Enable **Storage**
5. Register a **Web App** and copy the config values

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Create an admin user

In Firebase Console → Authentication → Users, add a user with email and password. This user will be the admin.

### 5. Seed initial data (optional)

In Firebase Console → Firestore, manually add:

- **categories** collection: Add documents with fields `name` (string), `thumbnailUrl` (string), `order` (number)
- **bakers** collection: Add documents with fields `name` (string), `active` (boolean: true), `createdAt` (timestamp)

Or use the admin dashboard to add categories and bakers after logging in.

### 6. Run locally

```bash
npm run dev
```

- Baker view: `http://localhost:5173/`
- Admin login: `http://localhost:5173/admin/login`

## Deployment

### Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Update `.firebaserc`

Set your project ID in `.firebaserc`:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### Deploy

```bash
npm run build
firebase deploy
```

This deploys:
- Hosting (the built app from `dist/`)
- Firestore security rules
- Storage security rules
- Firestore indexes

## Project Structure

```
src/
  admin/          — Admin dashboard pages
  baker/          — Baker-facing pages
  components/     — Shared UI components
  hooks/          — Firebase data hooks
  lib/            — Firebase config
```

## User Types

### Baker
- Selects their name from a list on the home screen
- Browses categories and recipes
- Access is logged (open time, close time)
- No authentication required

### Admin
- Logs in with email/password at `/admin/login`
- Manages recipes (CRUD with image upload)
- Manages categories (CRUD with thumbnails)
- Manages baker roster (add, activate/deactivate)
- Views and exports access logs (CSV)
