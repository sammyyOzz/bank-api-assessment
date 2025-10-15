# 🏦 Bank API

A modular, scalable, and secure **Banking API** built with **Node.js**, **Express**, and **TypeScript**.  
This project follows clean architecture principles and focuses on **maintainability**, **security**, and **performance**.

---

## 🚀 Overview

This API simulates core banking operations such as **fund transfers**, **withdrawals**, **deposits**, and **account management**.  
It uses **JWT-based authentication**, **role-based access control (RBAC)**, **Redis caching**, and a **modular folder structure** for clarity and scalability.

---

## 🧠 Thought Process & Architectural Decisions

### 1. 🧩 Modular Structure

The project is organized into **modules**, where each module groups together all related files — such as **controllers**, **routes**, **validation schemas**, **types**, and **services**.  
This approach improves readability, maintainability, and scalability.

**Example structure:**

```bash
src/
┣ modules/
┃ ┣ auth/
┃ ┣ users/
┃ ┣ accounts/
┃ ┗ transactions/
┣ middleware/
┣ services/
┣ utils/
┣ config/
┣ app.ts
┗ index.ts
```

---

### 2. ⚙️ Separation of Concerns

I separated `index.ts` from `app.ts`:

- **`app.ts`**: Handles Express app initialization, route registration, and middleware setup.
- **`index.ts`**: Responsible for starting the server and connecting to external services like the database and Redis.

This makes the codebase easier to **test**, **maintain**, and **scale**.

---

### 3. 💪 TypeScript for Reliability

The API is built entirely in **TypeScript** to leverage:

- Static type checking
- IntelliSense support in IDEs
- Self-documenting code
- Reduced runtime errors

This ensures safer, more predictable, and maintainable code.

---

### 4. 🧰 Middleware Layer

Several reusable **Express middlewares** were implemented to ensure clean and modular logic:

- **Authentication (`auth.middleware`)** – Verifies JWT access tokens.
- **RBAC (`rbac.middleware`)** – Provides role-based access control (e.g., Admin vs User).
- **Validation (`validation.middleware`)** – Uses **Joi** to validate incoming request data.
- **Error Handling (`error.middleware`)** – Ensures consistent error responses across the API.
- **Rate Limiting (`rate-limiter.middleware`)** – Helps protect the API from excessive or abusive requests.

---

### 5. ⚡ Caching with Redis

Redis was integrated to cache frequently accessed data such as account information and session tokens.  
This helps:

- Reduce database reads
- Improve response time
- Scale efficiently under load

Redis plays a key role in maintaining high performance.

---

### 6. 🧮 Utility Classes and Helpers

To avoid repetitive logic, several utilities were built:

- **Logger (Winston)** – Provides structured and centralized logging.
- **Async Handler** – Wraps async route handlers to streamline error handling.
- **NumberGenerator** – Dynamically generates account numbers and transaction reference numbers.
- **Pagination Utility** – Reusable logic for paginating results, improving efficiency.
- **Token Manager** – Handles JWT token generation, verification, and refresh token management.

---

### 7. 🧱 Configuration Management

A dedicated `config/` directory holds environment and application configuration, including:

- MongoDB URI
- Redis configuration
- JWT secrets
- Application constants

This centralization simplifies configuration and environment setup.

---

### 8. 🧾 Validation Layer

Input validation is implemented with **Joi** to ensure strict data integrity.  
Validation schemas are defined per feature (e.g., `transaction.validation.ts`, `auth.validation.ts`), helping prevent invalid or malicious data from reaching the core logic.

---

### 9. 🧑‍💻 Controller and Service Layer

Each feature module has:

- **Controller** – Handles HTTP requests and responses.
- **Service** – Encapsulates the business logic.

This separation improves readability and makes each component testable in isolation.

---

### 10. 📄 Pagination

A **reusable pagination utility** ensures:

- Efficient data retrieval
- Reduced payload sizes
- Consistent pagination behavior across endpoints

Used in routes such as `/transactions/all` and `/transactions/me`.

---

### 11. 🧰 Developer Experience

- **Swagger documentation** (`swagger-jsdoc` + `swagger-ui-express`) provides a visual interface for exploring API endpoints.
- **TypeScript** and **linting tools** (ESLint + Prettier) ensure clean and consistent code.
- **Husky** can be used to auto-format and lint code on commits.

---

## 🧪 Testing Strategy

The architecture makes testing straightforward:

- Controllers can be tested independently using the exported `app` instance.
- Business logic within services can be unit tested in isolation.
- Integration tests can verify module interactions.

---

## 🧱 Technologies Used

| Category       | Technology |
| -------------- | ---------- |
| Language       | TypeScript |
| Framework      | Express.js |
| Database       | MongoDB    |
| Caching        | Redis      |
| Validation     | Joi        |
| Authentication | JWT        |
| Logging        | Winston    |
| Documentation  | Swagger    |
| Deployment     | Docker     |

---

## 🔒 Security Considerations

- Passwords hashed with **bcrypt**.
- **JWT authentication** with refresh token rotation.
- **Role-based access control** for admin-only operations.
- **Rate limiting** to prevent abuse.
- **Input validation** to prevent injection and invalid data attacks.
- Sensitive config managed via environment variables.

---

## ⚙️ Key Features

- ✅ User authentication (signup, login, refresh, logout)
- 💰 Account creation, deposit, withdrawal, and transfer
- 📜 Transaction history with pagination
- 🧑‍💼 Admin route to view all transactions
- ⚡ Redis caching layer
- 📚 Swagger documentation
- 🚨 Centralized error handling
- 🐳 Deployment using Docker

---

## 🧭 Future Improvements

- Add unit and integration tests (e.g. Jest)
- Add CI/CD pipeline for testing and deployment
- Enhance audit logging for compliance and debugging

---

## 📚 API Documentation

Swagger documentation is available at:

GET /api-docs

---

## ⚙️ Setup & Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/sammyyOzz/bank-api-assessment.git
cd bank-api
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Create an .env File

```bash
yarn install
```

Example .env:

```bash
PORT=5000
MONGODB_URL=mongodb://localhost:27017/bankdb
HOST=localhost

JWT_SECRET=someSuperSecretKey
JWT_ACCESS_EXPIRATION=30m
JWT_REFRESH_EXPIRATION=7d

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 4. Start Redis (if not running)

```bash
redis-server
```

### 5. Run the App

```bash
yarn dev
```

Or build and start in production:

```bash
yarn build
yarn start
```

## 👨‍💻 Author

Samuel Oziegbe
Fullstack Developer
📧 [sammyoziegbe@gmail.com](mailto:sammyoziegbe@gmail.com)
