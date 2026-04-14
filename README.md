# E-Commerce Full Stack Application

This is a full-stack MERN & MySQL web application. The frontend is built using Next.js (App Router), and the backend uses Node.js with Express.js. The application incorporates a hybrid database architecture, storing relational data in MySQL and document-oriented data in MongoDB.

---

## 🛠 Installation Steps

To install dependencies, clone the repository, navigate to the folder, and run the following in separate terminal windows for the backend and frontend:

**Backend Setup:**
```bash
cd backend
npm install
```

**Frontend Setup:**
```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

You need to establish environment configurations for both the backend and frontend.

**1. Backend `.env` file**  
Create a `.env` file in the root of the **`backend`** directory:
```env
PORT=5050
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=Admin@123
MYSQL_DATABASE=ecommerce_db
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=vjRww5tx+JU3rW3EFNzcpxxUAPMv/eQ39/Zb8yxSXMJUyWquAo4qR15khVNvatsh
JWT_EXPIRES_IN=7d
```

**2. Frontend `.env` file**  
Create a `.env` file in the root of the **`frontend`** directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

---

## 🗄 Database Setup

This project uses both MySQL for structured, transactional data, and MongoDB for unstructured collections. 

### MySQL Setup
1. Ensure your local MySQL server is running.
2. Connect to MySQL and create the database by running: `CREATE DATABASE ecommerce_db;`
3. Execute the provided SQL schema locally from `backend/schema.sql`. It contains:
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','confirmed','delivered','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

### MongoDB Setup
1. Ensure your local MongoDB server is operating.
2. The Node.js server automatically connects to the server utilizing the `MONGODB_URI` environment string:
```
mongodb://localhost:27017/ecommerce
```
*Note: Because MongoDB is schema-less and creates databases/collections automatically on write insertion, further initial configuration isn't strictly necessary.*

---

## 🚀 How to Run Backend and Frontend Separately

Both directories maintain their own `package.json` with dedicated scripts. You will need to spin them up concurrently in two separate terminal shells.

**Running the Backend Dev Server:**
```bash
cd backend
npm run dev
# The backend API should be running on http://localhost:5050
```

**Running the Frontend Dev Server:**
```bash
cd frontend
npm run dev
# The Next.js frontend should be accessible at http://localhost:3000
```

---

## 📁 Repository Structure & File Explanations

### `backend/` Folder
The backend is a Node.js REST API utilizing Express.js.
- **`__tests__/`**: Holds Jest suite testing sequences to validate routes, models, and operations.
- **`config/`**: Sets up and exports connection objects bridging with databases (e.g., MySQL driver setup, MongoDB mongoose connect).
- **`controllers/`**: Extracts business-logic and handlers to fulfill endpoint routes.
- **`data/`**: Mock data, seeder files, or JSON dumps typically utilized for test cases and initial populators.
- **`middleware/`**: Extracted functional layers inside the request/response pipeline (e.g., Auth verification logic, global Error Handlers).
- **`models/`**: Describes Object Relational Mappings. Contains `mongo/` parameters for MongoDB abstractions and `sql/` for structure and interactions targeting MySQL.
- **`routes/`**: Contains endpoint URLs mapping directly to designated controllers.
- **`app.js`**: Core module containing the Express app definition, initializing standard routes, body-fetching parameters, and core middleware injections.
- **`server.js`**: Script executable point initializing configurations, verifying the database connections, and opening port sockets.
- **`schema.sql`**: An explicitly written schema representing how tables inside the MySQL databases correlate with matching fields.
- **`jest.config.js`**: Core settings declaring how the standard testing suite behavior is intended.

### `frontend/` Folder
The frontend handles presentational features operating Next.js 14 via the modern App Router.
- **`app/`**: Standard App-Router structure handling server-side routings mapped locally utilizing `.tsx` page declarations, standard error structures, layout wrappers, and dynamic routing conventions.
- **`components/`**: Standard, un-tethered React interface parts (Buttons, Navbars, Product Cards) to keep main code layers DRy.
- **`lib/`**: Context and client functional sets assisting tasks including data-fetching parameters or string formatting.
- **`public/`**: Directory referencing external facing generic assets (image components, core icon metadata).
- **`types/`**: Contains core `.ts` implementations to ensure strict object interface models are globally inferred throughout React props.
- **`next.config.mjs`**: Next framework parameters for fine level behavior tuning inside transpiling workflows.
- **`tsconfig.json`**: TypeScript engine limitations identifying rules to block build compilations upon errors. 
