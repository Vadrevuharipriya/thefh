# The Famous Halwai Website

This is the repository for The Famous Halwai website. It consists of a React (Vite) frontend and an Express (Node.js) backend with MongoDB.

## Project Structure

- `/client` - The Vite + React frontend application.
- `/server` - The Express.js backend API.

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Firebase Account (for auth/storage features)
- Google Cloud Console (for OAuth)
- Resend API (for emails)
- WhatsApp Business API (for messaging)

### Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thefamoushalwai/the-famous-halwai-website-main.git
   cd the-famous-halwai-website-main
   ```

2. **Install dependencies for Server**
   ```bash
   cd server
   npm install
   ```

3. **Install dependencies for Client**
   ```bash
   cd ../client
   npm install
   ```

## Environment Variables

### Server (`/server/.env`)

Create a `.env` file in the `server` directory and add the following variables:

```env
# Server Configuration
PORT=5000
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/famous_halwai

# Authentication
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
# OR use JSON format:
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Resend API (Emails)
RESEND_API_KEY=your_resend_api_key

# WhatsApp Business API
WHATSAPP_BUSINESS_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_BUSINESS_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_BUSINESS_API_VERSION=v17.0
WHATSAPP_BUSINESS_LOGO_URL=https://www.thefamoushalwai.com/frontEnd/images/logo.png
```

### Client (`/client/.env`)

By default, the Vite client proxies API requests to `http://localhost:5000`. You typically do not need a `.env` file for local development unless you plan to override Vite's default behavior. If your production environment requires specific variables (like a production API URL), you might configure them using Vite's `VITE_` prefix, for example:

```env
VITE_API_URL=https://api.yourdomain.com
```
*(Check your production deployment settings for client-side API routing)*

## Running the Application

### Development Mode

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client**
   ```bash
   cd client
   npm run dev
   ```

The client will be available at `http://localhost:5173` and the server API at `http://localhost:5000`.

## Production Build

To build the client for production:
```bash
cd client
npm run build
```
The build output will be in the `client/dist` directory.
