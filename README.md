# LedgerFlow

LedgerFlow is a full-stack financial management web application designed to help small businesses and independent professionals manage clients, invoices, expenses, and financial activity from a centralized dashboard.

This project was developed as the **Final Project for the Ironhack Web Development Bootcamp**, using the MERN stack.

---

## 🌐 Live Demo

### Application
https://ledger-flow-frontend-three.vercel.app/

### Backend API
https://ledgerflow-api-lfry.onrender.com/

### GitHub Repositories

- Frontend: https://github.com/AndreRibeiro24/LedgerFlow-Frontend
- Backend: https://github.com/AndreRibeiro24/LedgerFlow-Backend

---

## 📖 About LedgerFlow

Managing clients, invoices, and expenses across different tools can quickly become difficult to organize.

LedgerFlow was created to provide a simple financial workspace where users can manage their business information and get a clear overview of their financial activity.

Each registered user has their own protected workspace. Clients, invoices, expenses, and categories are associated with the authenticated user, preventing access to resources belonging to other accounts.

The application combines a **React frontend**, a **Node.js / Express REST API**, and a **MongoDB database**.

---

## ✨ Features

### Authentication

- User registration
- User login and logout
- JWT-based authentication
- Password hashing with bcrypt
- Password strength validation
- Persistent authentication using local storage
- Protected frontend routes
- Protected backend endpoints
- Inactive account validation
- User feedback for authentication errors

### Dashboard

The dashboard provides an overview of the user's financial activity, including:

- Total clients
- Total invoices
- Total expenses
- Total revenue
- Total expense amount
- Profit calculation
- Invoice status distribution
- Recent invoices
- Recent expenses
- Expenses grouped by category
- Financial data visualization

### Client Management

Users can:

- Create clients
- View all clients
- View individual client details
- Edit client information
- Delete clients
- Store contact and billing information
- Prevent duplicate tax numbers within the same account

All client operations are scoped to the authenticated user.

### Invoice Management

Users can:

- Create invoices
- View invoices
- View detailed invoice information
- Edit invoices
- Delete invoices
- Associate invoices with clients
- Add multiple invoice items
- Define quantity and unit price
- Automatically calculate subtotal, VAT, and total
- Manage invoice statuses
- Add invoice notes
- Print invoice details
- Display invoice values in EUR, USD, or GBP

Invoice numbers are validated to prevent duplicates for the same user.

### Expense Management

Users can:

- Create expenses
- View expenses
- Edit expenses
- Delete expenses
- Assign categories
- Define payment methods
- Add optional notes
- Track expense dates and amounts

### Category Management

Users can create and manage their own expense categories.

Features include:

- Create categories
- Edit categories
- Delete categories
- Duplicate category prevention
- User-specific category ownership

### User Interface

LedgerFlow includes:

- Responsive desktop and mobile layouts
- Light mode
- Dark mode
- Responsive navigation
- Interactive dashboard charts
- Form validation and user feedback
- Loading states
- Empty states
- Financial value formatting
- Dynamic currency formatting
- Mobile-friendly forms and tables

---

## 🛠️ Tech Stack

### Frontend

- **React 19** — Component-based user interface
- **Vite** — Development and production build tooling
- **React Router** — Client-side routing and protected navigation
- **Axios** — HTTP communication with the REST API
- **Tailwind CSS** — Responsive styling and dark mode
- **Recharts** — Dashboard charts and data visualization
- **React Icons** — User interface icons

### Backend

- **Node.js** — Server-side JavaScript runtime
- **Express 5** — REST API framework
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB object modelling and schema validation
- **JSON Web Token (JWT)** — Authentication
- **bcrypt** — Password hashing
- **CORS** — Cross-origin request handling
- **Morgan** — HTTP request logging
- **dotenv** — Environment variable management
- **Nodemon** — Development server auto-reloading

### Deployment

- **Vercel** — Frontend deployment
- **Render** — Backend API deployment
- **MongoDB Atlas** — Cloud database

---

## 🏗️ Application Architecture

```text
                    ┌──────────────────────┐
                    │       Vercel         │
                    │                      │
                    │   React + Vite App   │
                    └──────────┬───────────┘
                               │
                               │ HTTPS / Axios
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Render         │
                    │                      │
                    │ Node.js + Express API│
                    └──────────┬───────────┘
                               │
                               │ Mongoose
                               │
                               ▼
                    ┌──────────────────────┐
                    │    MongoDB Atlas     │
                    │                      │
                    │   Cloud Database     │
                    └──────────────────────┘
```

The frontend communicates with the backend through a REST API using Axios.

Authentication is handled using JSON Web Tokens. Authenticated requests include the JWT in the `Authorization` header:

```text
Authorization: Bearer <token>
```

The backend validates the token and identifies the authenticated user before allowing access to protected resources.

---

## 🔐 Authentication & Security

LedgerFlow implements several security and validation mechanisms.

### Password Security

Passwords are never stored as plain text.

Before a user is created, the password is hashed using **bcrypt**.

Passwords must contain:

- At least 8 characters
- An uppercase letter
- A lowercase letter
- A number
- A special character

### JWT Authentication

After a successful login, the backend generates a JWT containing information about the authenticated user.

Protected requests send the token through:

```http
Authorization: Bearer <token>
```

### Resource Ownership

Clients, invoices, expenses, and categories are associated with their owner.

Database queries verify both the requested resource and the authenticated user's ID.

This prevents one user from accessing or modifying another user's resources.

### Backend Validation

The API validates:

- Required fields
- Password requirements
- Duplicate users
- Duplicate client tax numbers
- Duplicate invoice numbers
- Duplicate categories
- Client ownership when creating or updating invoices
- Mongoose schema requirements

### Error Handling

The backend includes centralized Express error handling for unexpected server errors while controllers return appropriate HTTP status codes for expected validation errors.

---

## 📡 REST API

The backend API is available at:

```text
https://ledgerflow-api-lfry.onrender.com/api
```

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
```

### Clients

```text
GET    /api/clients
GET    /api/clients/:id
POST   /api/clients
PUT    /api/clients/:id
DELETE /api/clients/:id
```

### Invoices

```text
GET    /api/invoices
GET    /api/invoices/:id
POST   /api/invoices
PUT    /api/invoices/:id
DELETE /api/invoices/:id
```

### Expenses

```text
GET    /api/expenses
GET    /api/expenses/:id
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

### Categories

```text
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Dashboard

The dashboard API provides aggregated financial information including:

- Financial summary
- Invoice status summary
- Recent invoices
- Recent expenses
- Expenses grouped by category

All application data endpoints are protected and require authentication.

---

## 💾 Data Models

The application uses the following main MongoDB models:

```text
User
 ├── Clients
 ├── Invoices
 ├── Expenses
 └── Categories
```

### User

Stores authentication and account information.

### Client

Stores customer contact, tax, address, and additional information.

### Invoice

Stores invoice metadata, client association, invoice items, totals, currency, billing information, and status.

### Expense

Stores business expenses including amount, date, category, payment method, and notes.

### Category

Stores user-created expense categories.

---

## 🚀 Running the Project Locally

### Requirements

Make sure you have installed:

- Node.js
- npm
- MongoDB locally or a MongoDB Atlas database

---

### 1. Clone the Backend

```bash
git clone https://github.com/AndreRibeiro24/LedgerFlow-Backend.git
cd LedgerFlow-Backend
npm install
```

Create a `.env` file in the backend root:

```env
PORT=5005
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Then start the development server:

```bash
npm run dev
```

The backend will run locally on:

```text
http://localhost:5005
```

---

### 2. Clone the Frontend

Open another terminal:

```bash
git clone https://github.com/AndreRibeiro24/LedgerFlow-Frontend.git
cd LedgerFlow-Frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5005/api
```

Start the frontend:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

## 📜 Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
npm run dev
npm start
```

---

## 🌍 Deployment

LedgerFlow uses separate deployments for each layer of the application.

```text
Frontend
Vercel
↓
https://ledger-flow-frontend-three.vercel.app/

Backend
Render
↓
https://ledgerflow-api-lfry.onrender.com/

Database
MongoDB Atlas
```

Production environment variables are configured directly in Vercel and Render and are not committed to source control.

---

## 💱 Multi-Currency Support

Invoices currently support displaying values in:

- EUR (€)
- USD ($)
- GBP (£)

Currency formatting follows the currency selected for each invoice.

The current dashboard aggregation assumes a common base currency and **does not perform automatic foreign exchange conversion** between invoices.

Automatic FX conversion using exchange-rate data is planned as a future improvement.

---

## 🔮 Future Improvements

LedgerFlow can be expanded with several additional features:

- Automatic foreign exchange conversion
- User-selectable base currency
- Advanced financial reporting
- Revenue and expense trends over custom periods
- PDF invoice generation and export
- More advanced search and filtering
- Business profile and invoice settings
- Notification system
- Administrative roles and management tools
- Invoice payment reminders
- Additional dashboard analytics

---

## 🎯 Project Goals

The main goal of LedgerFlow was to demonstrate the development of a complete MERN full-stack application, including:

- REST API design
- CRUD operations
- MongoDB data modelling
- Frontend and backend integration
- Authentication and authorization
- Protected routes
- Backend validation
- Error handling
- Responsive interface development
- Data visualization
- Environment variable management
- Cloud database configuration
- Full-stack deployment

---

## 👨‍💻 Author

**André Ribeiro**

Final Project — Ironhack Web Development Bootcamp

### Project Links

Frontend Repository:  
https://github.com/AndreRibeiro24/LedgerFlow-Frontend

Backend Repository:  
https://github.com/AndreRibeiro24/LedgerFlow-Backend

Live Application:  
https://ledger-flow-frontend-three.vercel.app/

Backend API:  
https://ledgerflow-api-lfry.onrender.com/s