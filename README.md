# **Pharmatrix – Pharmacy Inventory & POS System**

Pharmatrix is a modern, full-stack pharmacy inventory management and POS (Point-of-Sale) system designed for efficient stock management, billing, supplier handling, and overall pharmacy operations.

This repository contains both:

- **Backend** – Node.js + Express + MongoDB
- **Frontend** – React (Vite)

---

## 🧱 **Tech Stack**

### **Backend**

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- MVC Architecture

### **Frontend**

- React (Vite)
- Axios

---

## 📁 **Project Structure**

```
pharmatrix/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env   (add to the root of the directory)
│
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

---

# ⚙️ **Backend Setup (Node.js + MongoDB)**

### **1. Navigate into the backend folder**

```bash
cd backend
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Create a `.env` file in the backend directory**

Create a file named `.env` and add the following:

```
PORT=4000
NODE_ENV='development'
MONGO_URI= <mongo atlas conn string>
ACCESS_SECRET_KEY= <secret key for access token>
REFRESH_SECRET_KEY= <secret key for refresh token>
```

➡️ Fill the values with your own database URL, DB name, and JWT secrets.

---

### **4. Start the backend server**

```bash
npm run dev
```

Your backend will now run at:

```
http://localhost:4000
```

---

# 🖥️ **Frontend Setup (React + Vite)**

### **1. Navigate into the frontend folder**

```bash
cd frontend
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Start the development server**

```bash
npm run dev
```

The frontend will run at something like:

```
http://localhost:5173
```

---

# 📘 **Features**

✔ Inventory management
✔ Batch and expiry tracking
✔ Supplier management
✔ GRN (Goods Received Note) module
✔ POS billing
✔ Secure authentication (Access + Refresh tokens)
✔ Dashboard & analytics
✔ Clean and scalable project structure

---

# 📄 **License**

This project is licensed under the MIT License
