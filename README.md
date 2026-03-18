# SUPERNOVA — MERN Microservices E-Commerce Platform

A production-grade, full-stack e-commerce platform built with the MERN stack and microservices architecture.

![SUPERNOVA](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80)

---

## 🚀 Live Demo

> Coming soon — AWS deployment in progress

---

## ✨ Features

- 🔐 **JWT Authentication** with access & refresh tokens + Google OAuth
- 🛍️ **Product Catalog** with search, filters, Redis caching
- 🛒 **Cart Management** with real-time price calculation
- 📦 **Order Management** with status tracking
- 💳 **Razorpay Payment** integration
- 🧑‍💼 **Seller Dashboard** — create, edit, delete products
- 🎨 **Modern Dark UI** built with React + DM Sans
- 🐳 **Docker** for local infrastructure (MongoDB, Redis, RabbitMQ)
- ☁️ **AWS Ready** — ECR, ECS Fargate, ALB deployment

---

## 🏗️ Architecture

```
supernova/
├── services/
│   ├── auth/          # JWT auth, register, login (Port 3001)
│   ├── product/       # Product CRUD + Redis cache (Port 3002)
│   ├── cart/          # Cart management (Port 3003)
│   ├── order/         # Order lifecycle (Port 3004)
│   └── payment/       # Razorpay integration (Port 3005)
├── client/            # React + Vite frontend (Port 5173)
└── docker-compose.yml # MongoDB + Redis + RabbitMQ
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js + Vite | UI framework |
| Redux Toolkit + RTK Query | State management |
| React Router v6 | Client-side routing |
| DM Sans (Google Fonts) | Typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API services |
| MongoDB + Mongoose | Primary database |
| Redis (ioredis) | Caching & rate limiting |
| RabbitMQ | Event-driven messaging |
| JWT | Authentication |
| Razorpay | Payment gateway |

### DevOps
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Local infrastructure |
| AWS ECR + ECS Fargate | Container deployment |
| AWS ALB | Load balancing |

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- Docker Desktop
- Git

### 1. Clone the repository
```bash
git clone https://github.com/vikasdongrepawar/supernova.git
cd supernova
```

### 2. Start infrastructure
```bash
docker-compose up -d
```

### 3. Setup environment variables

Create `.env` in each service folder:

**services/auth/.env**
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/supernova-auth
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
```

**services/product/.env**
```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/supernova-product
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

**services/cart/.env**
```env
PORT=3003
MONGO_URI=mongodb://localhost:27017/supernova-cart
JWT_SECRET=your_jwt_secret
PRODUCT_SERVICE_URL=http://localhost:3002
NODE_ENV=development
```

**services/order/.env**
```env
PORT=3004
MONGO_URI=mongodb://localhost:27017/supernova-order
JWT_SECRET=your_jwt_secret
CART_SERVICE_URL=http://localhost:3003
NODE_ENV=development
```

**services/payment/.env**
```env
PORT=3005
MONGO_URI=mongodb://localhost:27017/supernova-payment
JWT_SECRET=your_jwt_secret
ORDER_SERVICE_URL=http://localhost:3004
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=development
```

### 4. Start all services

Open 5 terminals and run:

```bash
# Terminal 1
cd services/auth && npm run dev

# Terminal 2
cd services/product && npm run dev

# Terminal 3
cd services/cart && npm run dev

# Terminal 4
cd services/order && npm run dev

# Terminal 5
cd services/payment && npm run dev
```

### 5. Start frontend

```bash
cd client && npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 📡 API Endpoints

### Auth Service (Port 3001)
| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /auth/me | Get current user |

### Product Service (Port 3002)
| Method | Endpoint | Description |
|---|---|---|
| GET | /products | Get all products |
| GET | /products/:id | Get single product |
| POST | /products | Create product (seller) |
| PATCH | /products/:id | Update product (seller) |
| DELETE | /products/:id | Delete product (seller) |

### Cart Service (Port 3003)
| Method | Endpoint | Description |
|---|---|---|
| GET | /cart | Get user cart |
| POST | /cart/items | Add item to cart |
| PATCH | /cart/items/:id | Update item quantity |
| DELETE | /cart/items/:id | Remove item |
| DELETE | /cart | Clear cart |

### Order Service (Port 3004)
| Method | Endpoint | Description |
|---|---|---|
| POST | /orders | Place order |
| GET | /orders/me | Get my orders |
| GET | /orders/:id | Get single order |
| POST | /orders/:id/cancel | Cancel order |

### Payment Service (Port 3005)
| Method | Endpoint | Description |
|---|---|---|
| POST | /payments/create | Create Razorpay order |
| POST | /payments/verify | Verify payment |
| GET | /payments/:id | Get payment details |

---

## 🎨 Screenshots

### Homepage
Dark minimal product catalog with category filters

### Seller Dashboard
Manage products, track inventory, view stats

### Product Detail
Full product page with quantity selector and add to cart

---

## 👨‍💻 Author

**Vikas Dongre**
- GitHub: [@vikasdongrepawar](https://github.com/vikasdongrepawar)
- LinkedIn: [linkedin.com/in/vikasdongre](https://linkedin.com/in/vikasdongre)
- Email: vikasdongre952@gmail.com

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.

---

> Built with ❤️ as a portfolio project to demonstrate full-stack microservices architecture