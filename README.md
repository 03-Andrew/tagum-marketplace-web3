# Tagum Marketplace POS + IMS

![Vue](https://img.shields.io/badge/Vue-3-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.2-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

**Tagum Marketplace POS + IMS** is a web-based Point of Sale (POS) and Inventory Management System (IMS) designed specifically for **Tagum Marketplace**. It provides a simple and efficient way to manage sales and inventory for the company.

---

## Features

- **Point of Sale (POS)**: Streamline sales transactions with an easy-to-use interface.
- **Inventory Management System (IMS)**: Track and manage inventory in real-time.
- **User Authentication**: Secure login system using bcryptjs and JSON Web Tokens (JWT).
- **Responsive Design**: Built with TailwindCSS and DaisyUI for a modern and responsive UI.
- **Data Visualization**: Display sales data using ApexCharts.

---

## Technologies Used

- **Frontend**:
  - Vue 3
  - Vue Router
  - TailwindCSS
  - DaisyUI
  - Axios (for API requests)
  - ApexCharts (for data visualization)

- **Backend**:
  - Express.js
  - MySQL2 (for database connectivity)
  - Bcryptjs (for password hashing)
  - JSON Web Tokens (JWT) (for authentication)
  - Body-parser (for parsing request bodies)
  - CORS (for handling cross-origin requests)
  - Dotenv (for environment variables)

---

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yasinans/tagum-marketplace-web.git
   cd tagum-marketplace-web
   ```

2. **Install dependencies**:
   - For the frontend:
     ```bash
     npm install
     ```
   - For the backend:
     ```bash
     cd api
     npm install
     ```

3. **Set up the database**:
   - Import the provided SQL file (`database.sql`) into your MySQL server.
   - Update the database credentials in the `/api/.env` file:
     ```env
     DB_HOST=your_database_host
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=your_database_name
     ```

4. **Configure the API**:
   - Update the API port in the root `.env` file (if needed):
     ```env
     VITE_PORT = 1420
     ```

5. **Run the application**:
   - Start the backend server:
     ```bash
     cd api
     node server.js
     ```
   - Start the frontend development server:
     ```bash
     cd ..
     npm run dev
     ```

6. **Access the application**:
   - Open your browser and navigate to `http://localhost:1420`.
   - Use the default credentials to log in:
     - **Username**: `admin`
     - **Password**: `admin`

---

## Configuration

### Environment Variables

- **Frontend (root `.env`)**:
  ```env
  VITE_PORT = 1420
  ```

- **Backend (`/api/.env`)**:
  ```env
  DB_HOST=your_database_host
  DB_USER=your_database_user
  DB_PASSWORD=your_database_password
  DB_NAME=your_database_name
  JWT_SECRET=your_jwt_secret_key
  ```

---

## Build for Production

To build the frontend for production, run:
```bash
npm run build
```

The production-ready files will be generated in the `dist` folder.

---

## License

This project is for educational purposes only and is not intended for public use or contribution.

---

## Acknowledgments

This project was developed as part of a school project. Special thanks to the creators of Vue, TailwindCSS, DaisyUI, and other open-source libraries used in this project.

---

## Wireframes

![image](https://github.com/user-attachments/assets/0922725d-9447-40d4-9698-9d3f8335f24e)

![image](https://github.com/user-attachments/assets/713162db-8875-4c36-a4df-2e44ac7a7030)
