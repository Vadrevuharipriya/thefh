# The Famous Halwai Website - Comprehensive Documentation

Welcome to the official repository for **The Famous Halwai** web application. This comprehensive documentation covers every aspect of the project, including the technology stack, architecture, detailed folder structure, data models, and instructions on how to set up, run, and maintain the project.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Detailed Technology Stack](#detailed-technology-stack)
   - [Frontend Ecosystem](#frontend-ecosystem)
   - [Backend Ecosystem](#backend-ecosystem)
   - [Database & Infrastructure](#database--infrastructure)
3. [System Architecture & Data Flow](#system-architecture--data-flow)
4. [Comprehensive Folder Structure](#comprehensive-folder-structure)
5. [Data Models & Database Schema](#data-models--database-schema)
6. [API Endpoints Overview](#api-endpoints-overview)
7. [Environment Variables in Detail](#environment-variables-in-detail)
8. [Setup & Installation Guide](#setup--installation-guide)
9. [Development Workflow](#development-workflow)
10. [Deployment Strategies](#deployment-strategies)
11. [Maintenance & Best Practices](#maintenance--best-practices)

---

## 1. Project Overview

**The Famous Halwai** is a robust, full-stack web application tailored for a premium catering and food delivery service. The platform allows users to explore menus, book catering services, submit inquiries, and interact with the brand, while providing a powerful administrative dashboard to manage products, blogs, users, orders, and site content dynamically.

The application is built using a modern **MERN** (MongoDB, Express.js, React, Node.js) stack, enhanced with Vite for lightning-fast frontend tooling and Tailwind CSS for rapid UI development.

---

## 2. Detailed Technology Stack

### Frontend Ecosystem

#### Core Frameworks & Build Tools
* **React 18**: The core library for building the user interface. It utilizes functional components, React Hooks for state management, and an entirely declarative UI paradigm.
* **Vite**: The build tool of choice. Vite replaces Webpack/CRA, providing incredibly fast Hot Module Replacement (HMR) and optimized production builds via Rollup.
* **React Router DOM v7**: Handles all client-side routing. It enables seamless transitions between public pages (Home, Menu, About, Contact) and protected admin dashboard routes without full page reloads.

#### Styling & UI Components
* **Tailwind CSS**: A utility-first CSS framework. It allows for highly customizable, responsive designs directly within JSX, eliminating the need for context-switching between CSS and JS files.
* **SASS (SCSS)**: Used alongside Tailwind for complex, nested styles or specific component overrides where utility classes become too cumbersome.
* **Headless UI**: Provides unstyled, fully accessible UI components (like modals, dropdowns, and tabs) that integrate perfectly with Tailwind CSS.
* **Lucide React & FontAwesome**: Provides a vast library of crisp, scalable vector icons used throughout the UI for navigation, actions, and aesthetic enhancement.
* **React Quill**: A rich text editor used in the admin panel for creating and editing blog posts, allowing for WYSIWYG text formatting.
* **SortableJS**: Used for drag-and-drop interactions, potentially for ordering items like banners, gallery images, or categories in the admin dashboard.

#### API Communication & Data Fetching
* **Axios**: A promise-based HTTP client. It is configured to handle API requests to the backend, intercepting requests to inject authentication tokens and handling response errors globally.

### Backend Ecosystem

#### Core Frameworks
* **Node.js**: The runtime environment executing JavaScript on the server.
* **Express.js**: A fast, unopinionated, minimalist web framework for Node.js. It handles routing, middleware integration, and API request processing.

#### Security & Authentication
* **JSON Web Tokens (JWT)**: Used for stateless user authentication. Upon login, a JWT is issued, and subsequent requests to protected routes must include this token in the Authorization header.
* **Bcrypt.js**: A password hashing function used to securely store user and admin passwords in the database.
* **Google Auth Library**: Facilitates Google OAuth integration, allowing users to sign in or sign up using their Google accounts.
* **Firebase Admin SDK**: Integrates with Firebase services. This is typically used for push notifications, advanced authentication flows, or cloud storage integration.
* **CORS**: Middleware configured to allow cross-origin requests from the React frontend to the Express backend.

#### File Processing & Generation
* **Multer**: Node.js middleware for handling `multipart/form-data`, primarily used for uploading images (e.g., product photos, blog thumbnails, banners) to the server.
* **jsPDF & jsPDF-AutoTable**: Used on the server-side to generate PDF documents dynamically, such as invoices, quotations, or reports, directly from database data.

#### External Integrations
* **Resend**: A modern email API used for transactional emails (e.g., password resets, order confirmations, inquiry acknowledgments).
* **WhatsApp Business API**: Integrated to send automated WhatsApp messages for order updates or customer engagement.

### Database & Infrastructure
* **MongoDB**: A NoSQL document database. It provides high performance, high availability, and easy scalability. Documents are stored in JSON-like format.
* **Mongoose**: An elegant MongoDB object modeling tool for Node.js. It provides schema validation, query building, and business logic hooks for MongoDB data.

---

## 3. System Architecture & Data Flow

The Famous Halwai application follows a classic client-server architecture with a RESTful API.

### Request Flow
1. **Client Interaction**: A user interacts with the React frontend (e.g., submitting an inquiry form).
2. **API Call**: Axios intercepts the action, attaches the JWT (if applicable), and sends an HTTP request to the Express backend (e.g., `POST /api/enquiries`).
3. **Middleware Processing**: The request passes through Express middleware (CORS, body-parsing, JWT verification via `requireUserAuth` or `requireAdmin`).
4. **Controller Logic**: The route delegates to a specific controller function.
5. **Database Interaction**: The controller uses Mongoose models to query or mutate data in MongoDB.
6. **External Services**: If necessary, the controller triggers external APIs (like Resend for emails or WhatsApp API).
7. **Response**: The controller formats a JSON response and sends it back to the client.
8. **UI Update**: React processes the response and updates the DOM accordingly (e.g., showing a success toast).

---

## 4. Comprehensive Folder Structure

A deep dive into how the repository is organized.

```
the-famous-halwai/
│
├── client/                      # Frontend React Application
│   ├── public/                  # Static assets (favicon, manifest, raw images)
│   ├── src/
│   │   ├── assets/              # Processed assets (SVG icons, images used in CSS)
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Admin/           # Components specific to the admin dashboard
│   │   │   ├── Common/          # Shared components (Buttons, Inputs, Modals)
│   │   │   └── Layout/          # Header, Footer, Sidebar, Navigation
│   │   ├── contexts/            # React Context API files (AuthContext, ThemeContext)
│   │   ├── data/                # Hardcoded datasets, constants, or mock data
│   │   ├── pages/               # Top-level route components (views)
│   │   │   ├── Admin/           # Admin dashboard pages (ManageUsers, EditBlog, etc.)
│   │   │   ├── Public/          # Public-facing pages (Home, About, Menu)
│   │   │   └── Auth/            # Login, Signup, Forgot Password pages
│   │   ├── routes/              # Route configuration and protected route wrappers
│   │   ├── styles/              # Global SASS/CSS files and variables
│   │   ├── utils/               # Helper functions (date formatting, validation)
│   │   ├── App.jsx              # Main React application wrapper
│   │   ├── main.jsx             # React DOM rendering entry point
│   │   └── index.css            # Tailwind entry file
│   ├── .eslintrc.js             # ESLint configuration
│   ├── index.html               # Main HTML template
│   ├── tailwind.config.js       # Tailwind CSS configuration & theme extension
│   └── vite.config.js           # Vite build and proxy configuration
│
├── server/                      # Backend Node.js/Express Application
│   ├── assets/                  # Static assets served by the backend (e.g., email templates)
│   ├── controllers/             # Business logic layer
│   │   ├── accountController.js # Handles user accounts and profiles
│   │   ├── authController.js    # Registration, Login, OAuth, JWT issuance
│   │   ├── blogsController.js   # CRUD operations for blogs
│   │   ├── enquiryController.js # Processing contact forms and inquiries
│   │   ├── orderController.js   # Managing orders and quotations
│   │   ├── uploadController.js  # Handling file uploads via Multer
│   │   └── ... (many more controllers for specific entities)
│   │
│   ├── middleware/              # Express middleware functions
│   │   ├── errorHandler.js      # Global error catching and formatting
│   │   ├── requireAdmin.js      # Verifies JWT and checks for admin privileges
│   │   ├── requireUserAuth.js   # Verifies JWT for standard users
│   │   ├── uploadMiddleware.js  # Multer configuration for file uploads
│   │   └── validation.js        # Request body validation (express-validator)
│   │
│   ├── models/                  # Mongoose Schemas and Models (Detailed below)
│   │
│   ├── routes/                  # Express route definitions
│   │   ├── authRoutes.js        # Maps `/api/auth/*` to authController
│   │   ├── blogsRoutes.js       # Maps `/api/blogs/*` to blogsController
│   │   └── ... (routes map to their respective controllers)
│   │
│   ├── scripts/                 # Utility scripts for database management
│   │   ├── seed.js              # Seeds the database with initial/dummy data
│   │   ├── firebase-sync.js     # Synchronizes data with Firebase
│   │   └── ... (other seeding and migration scripts)
│   │
│   ├── services/                # Integration with external APIs and complex logic
│   │   ├── emailService.js      # Resend API integration
│   │   ├── pdfService.js        # jsPDF generation logic
│   │   └── whatsappService.js   # WhatsApp Business API integration
│   │
│   ├── utils/                   # Shared utility functions
│   │   ├── auth.js              # JWT generation/verification helpers
│   │   ├── otpUtils.js          # One-Time Password generation logic
│   │   └── responseHandler.js   # Standardized API response formatter
│   │
│   ├── db.js                    # MongoDB connection logic
│   ├── index.js                 # Express server entry point and configuration
│   └── sample-data.js           # Sample JSON data for seeding
│
├── .gitignore                   # Ignored files for Git
└── README.md                    # This comprehensive documentation file
```

---

## 5. Data Models & Database Schema

The backend utilizes **23 Mongoose models** to represent the complex domain of a catering business. Below is an overview of the core models and their purpose:

### User & Authentication
* **`User.js`**: Represents standard customers. Contains fields for name, email, password hash, phone number, and Google OAuth IDs.
* **`PanelUser.js`**: Represents administrative or staff accounts with specific roles and permissions to access the admin dashboard.
* **`Account.js`**: Handles financial or extended profile details linked to a user.

### Content Management (CMS)
* **`Blog.js`**: Stores blog posts. Fields include title, slug, content (rich text), author, cover image URL, and SEO metadata.
* **`Banner.js`**: Manages homepage or promotional banners (image URLs, link destinations, active status).
* **`Testimonial.js`**: Customer reviews and ratings displayed on the website.
* **`WebsitePage.js`**: Allows dynamic creation of static pages (e.g., Privacy Policy, Terms of Service) directly from the admin panel.

### Catering & Menu Management
* **`Product.js`**: The core menu items (e.g., "Samosa", "Gulab Jamun"). Contains price, description, category, and images.
* **`Category.js` / `ServiceCategory.js`**: Categorization for products to build organized menus.
* **`Cuisine.js`**: Represents types of cuisines offered (e.g., North Indian, South Indian, Continental).
* **`Meal.js`**: Preset meal packages (e.g., "Standard Wedding Thali").
* **`Service.js`**: Specialized catering services offered (e.g., Live Counters, Buffet Setup).
* **`Chef.js`**: Profiles of the culinary team to showcase expertise on the website.

### Business Operations
* **`Enquiry.js`**: General contact form submissions from the public website.
* **`OrderInquiry.js`**: Specific requests for catering quotations, detailing guest count, event date, and selected menus.
* **`Order.js`**: Confirmed catering orders, linking to a user, a quotation, and tracking payment status.
* **`Event.js` / `Occasion.js`**: Categorization of events catered (e.g., Weddings, Corporate Events, Birthdays) to help users filter menus.
* **`Location.js`**: Serviceable areas and venue partnerships.
* **`Schedule.js`**: Availability and booking calendars.
* **`JobWorkerRate.js`**: Internal tracking for staff/worker costs (e.g., waiter rates, cleaning staff rates).
* **`Loyalty.js`**: Customer loyalty program tracking, points accumulation, and redemption.
* **`Referral.js`**: Tracking customer referral codes and rewards.

---

## 6. API Endpoints Overview

The backend exposes a RESTful API prefixed with `/api`.

* **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/google`
* **Public Content**: `/api/blogs`, `/api/banners`, `/api/testimonials` (GET requests are public)
* **Menu/Products**: `/api/products`, `/api/categories`
* **Inquiries**: `/api/enquiries` (POST for users, GET for admins)
* **Admin (Protected)**: Almost all routes support POST, PUT, DELETE operations but require a valid Admin JWT.

*All API responses are standardized using the `responseHandler.js` utility for consistent frontend consumption.*

---

## 7. Environment Variables in Detail

Proper configuration of environment variables is crucial for the application to function.

### Server-Side (`/server/.env`)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `PORT` | The port the Express server listens on. | `5000` |
| `BASE_URL` | The public URL of the backend API. | `http://localhost:5000` |
| `CLIENT_URL` | The URL of the React frontend (used for CORS). | `http://localhost:5173` |
| `MONGODB_URI` | Connection string for MongoDB. | `mongodb://localhost:27017/famous_halwai` |
| `JWT_SECRET` | Secret key used to sign and verify JWTs. | *(Must be a strong random string)* |
| `ADMIN_EMAIL` | Default admin account email for initial setup. | `admin@thefamoushalwai.com` |
| `ADMIN_PASSWORD`| Default admin password. | *(Change immediately in production)* |
| `GOOGLE_CLIENT_ID` | For Google OAuth login integration. | `your-google-client-id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET`| Secret for Google OAuth. | *(Keep secure)* |
| `RESEND_API_KEY`| API key for sending emails via Resend. | `re_...something...` |
| `FIREBASE_PROJECT_ID`| Firebase configuration for push/storage. | `famous-halwai-app` |
| `FIREBASE_CLIENT_EMAIL`| Firebase service account email. | `firebase-adminsdk...iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY`| Firebase private key string. | `-----BEGIN PRIVATE KEY-----\n...` |
| `WHATSAPP_BUSINESS_ACCESS_TOKEN`| Token for WhatsApp messaging. | *(From Meta Developer Dashboard)* |
| `WHATSAPP_BUSINESS_PHONE_NUMBER_ID`| Specific Phone ID for WhatsApp API. | `123456789012345` |

### Client-Side (`/client/.env`)

Vite automatically handles proxying during development (via `vite.config.js`). However, for production deployment, you must specify the backend URL.

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | The production URL of the Node.js backend. | `https://api.thefamoushalwai.com` |

*(Note: In Vite, only variables prefixed with `VITE_` are exposed to the client-side code).*

---

## 8. Setup & Installation Guide

Follow these steps to get the project running locally from scratch.

### Prerequisites
1. **Node.js**: Ensure Node.js v16+ is installed.
2. **MongoDB**: Have MongoDB Community Server running locally, or have an Atlas connection string ready.
3. **Git**: For version control.

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/thefamoushalwai/the-famous-halwai-website-main.git
   cd the-famous-halwai-website-main
   ```

2. **Setup the Backend (Server)**
   ```bash
   cd server
   # Install dependencies
   npm install

   # Create the environment file
   cp .env.example .env  # Or create .env manually and fill it using the guide above

   # (Optional) Seed the database with initial data
   npm run seed
   ```

3. **Setup the Frontend (Client)**
   ```bash
   cd ../client
   # Install dependencies
   npm install
   ```

---

## 9. Development Workflow

To start developing locally, you need to run both the client and server concurrently.

1. **Start the Backend Server**
   Open a terminal terminal:
   ```bash
   cd server
   npm run dev
   ```
   *This uses node --watch (or nodemon) to automatically restart the server upon file changes.*

2. **Start the Frontend Client**
   Open a new, separate terminal window:
   ```bash
   cd client
   npm run dev
   ```
   *This starts the Vite development server with Hot Module Replacement.*

3. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 10. Deployment Strategies

### Backend Deployment (e.g., Render, Railway, DigitalOcean)
1. Set the Node.js environment to production.
2. Provide all environment variables in the hosting provider's dashboard.
3. Start command: `npm start` (which runs `node index.js`).
4. Ensure CORS settings in `index.js` accept requests from your production frontend domain.

### Frontend Deployment (e.g., Vercel, Netlify, Cloudflare Pages)
1. Set the root directory to `/client`.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add the `VITE_API_URL` environment variable pointing to your deployed backend URL.
5. *Important for React Router*: Ensure the hosting provider is configured for Single Page Applications (SPA) by rewriting all traffic to `index.html`. (A `vercel.json` or `_redirects` file is typically used for this).

---

## 11. Maintenance & Best Practices

* **Code Style**: The project uses ESLint. Run `npm run lint` in the client directory before committing code to ensure consistency.
* **Database Backups**: Regularly backup the MongoDB database using `mongodump`, especially before running large migration scripts.
* **Security**: Never commit `.env` files to version control. Regularly update npm packages (`npm audit`) to patch security vulnerabilities.
* **Asset Optimization**: Uploaded images via the admin panel should ideally be compressed before saving to save storage space and bandwidth.

---
*Documentation last updated: June 2026*
