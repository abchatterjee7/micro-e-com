# MicroEcom (Production-Grade Microservices E-Commerce Platform)

A comprehensive e-commerce platform built with Java 25, Spring Boot 4, and React (Vite). Features event-driven microservices, Saga choreography, and modern frontend aesthetics.

## Table of Contents
- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Services Overview](#services-overview)
- [Design Patterns](#design-patterns)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [How to Run (Docker Only)](#how-to-run-docker-only)
- [Credentials & Testing](#credentials--testing)
- [Development Guidelines](#development-guidelines)
- [Production Deployment](#production-deployment)

---

## Key Features
- **Full E-Commerce Flow**: Browse products, add to cart, checkout, and payment.
- **Admin Dashboard**: Manage products (Add/Edit/Delete) with image upload (Cloudinary).
- **Authentication**: Keycloak OAuth 2.0 / OpenID Connect with Role-Based Access Control (Admin/User).
- **Payment Integration**: Razorpay integration for secure payments.
- **Event-Driven**: Order placement triggers payment and notification events via Kafka.
- **Resilience**: Circuit breakers, retries, and dead-letter topics (DLT).
- **Real-time Updates**: Kafka-based event streaming for order status.
- **Image Management**: Cloudinary integration for product images.
- **Responsive Design**: Mobile-first design with Tailwind CSS.
- **Search & Filtering**: Product search and category-based filtering.

---

## Architecture Overview

### Microservices Communication
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend    │    │  API Gateway   │    │  Keycloak      │
│   (React)     │◄──►│  (Spring       │◄──►│  (OAuth 2.0)   │
│   Port: 5173   │    │  Cloud)        │    │  Port: 8080     │
└─────────────────┘    │  Port: 8095    │    └─────────────────┘
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────────────────────────────────────┐
                       │          Service Mesh                   │
                       │                                         │
                       ┌─────────────┬─────────────┬─────────────┐
                       │Product      │Order        │Payment      │
                       │Service      │Service      │Service      │
                       │:8090        │:8097        │:8098        │
                       └─────────────┴─────────────┴─────────────┘
                                │
                                ▼
                       ┌─────────────────────────────────────────────────┐
                       │      Infrastructure & Data Layer          │
                       │                                         │
                       ┌─────────────┬─────────────┬─────────────┐
                       │PostgreSQL   │MongoDB     │Kafka        │
                       │(Orders)     │(Products)   │(Events)     │
                       │:5432        │:27017       │:9092         │
                       └─────────────┴─────────────┴─────────────┘
```

### Event Flow (Saga Pattern)
1. **Order Initiated** → Order Service creates order with PENDING status
2. **Payment Processed** → Payment Service attempts Razorpay payment
3. **Payment Success** → Order Service updates status to CONFIRMED
4. **Inventory Updated** → Product Service updates stock levels
5. **Notification Sent** → Notification Service sends confirmation
6. **Failure Handling** → DLT Replay Service handles failed events

---

## Services Overview

| Service | Port | Description | Key Responsibilities |
| :--- | :--- |:--- |
| **Frontend** | `5173` | React + TypeScript UI with Tailwind CSS. Product browsing, cart, checkout, user management. |
| **API Gateway** | `8095` | Central entry point, routing, rate limiting, JWT validation, load balancing. |
| **Auth Service** | `8096` | Keycloak proxy for login/signup (facade pattern). User authentication and token management. |
| **Product Service** | `8090` | Product management, inventory tracking, image upload to Cloudinary. |
| **Order Service** | `8097` | Order lifecycle, Saga orchestration, status management. |
| **Payment Service** | `8098` | Payment processing (Razorpay), transaction logging. |
| **Notification Service** | `8099` | Email/SMS notifications (simulated), event-driven updates. |
| **DLT Replay Admin** | `8088` | Admin tool for replaying failed events, system monitoring. |

---

## Design Patterns

### 1. **Saga Pattern**
- **Order Management Saga**: Coordinates distributed transaction across services
- **Compensation Actions**: Automatic rollback on payment failures
- **State Management**: Order status tracking through lifecycle

### 2. **API Gateway Pattern**
- **Single Entry Point**: All client requests go through gateway
- **Cross-Cutting Concerns**: Authentication, rate limiting, logging
- **Service Discovery**: Dynamic routing to microservices

### 3. **Event-Driven Architecture**
- **Kafka Topics**: 
  - `order-events`: Order lifecycle events
  - `payment-events`: Payment processing events
  - `notification-events`: Customer notifications
- **Event Sourcing**: Audit trail through event logs

### 4. **CQRS Pattern**
- **Command Query Separation**: Write operations (commands) vs read operations (queries)
- **Eventual Consistency**: Synchronized state through events

---

## Technology Stack

### Backend
- **Java 25**: Latest LTS with modern features
- **Spring Boot 4**: Auto-configuration, production-ready defaults
- **Spring Cloud Gateway**: API gateway with filters and routing
- **Spring Data JPA**: Database abstraction layer
- **Spring Kafka**: Event streaming and messaging

### Frontend
- **React 18**: Modern hooks and concurrent features
- **TypeScript**: Type safety and better IDE support
- **Vite**: Fast development server and optimized builds
- **Tailwind CSS**: Utility-first CSS framework

### Authentication & Security
- **Keycloak 22**: OAuth 2.0/OpenID Connect server
- **JWT Tokens**: Stateless authentication
- **Role-Based Access**: ADMIN vs USER permissions

### Infrastructure
- **Docker**: Containerization and orchestration
- **Docker Compose**: Multi-container deployment
- **PostgreSQL**: Primary relational database (orders, users)
- **MongoDB**: Document database (products, catalogs)
- **Redis**: Caching and session storage
- **Kafka**: Event streaming and message queue
- **Zookeeper**: Kafka cluster coordination

### Integrations
- **Cloudinary**: Cloud image storage and CDN
- **Razorpay**: Indian payment gateway integration
- **Circuit Breaker**: Resilience4j for fault tolerance

---

## Database Schema

### PostgreSQL (Orders & Users)
```sql
-- Users table (simplified)
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    items JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### MongoDB (Products & Catalog)
```javascript
// Products collection
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  image_url: String, // Cloudinary URL
  created_at: Date,
  updated_at: Date
}

// Categories collection
{
  _id: ObjectId,
  name: String,
  description: String,
  created_at: Date
}
```

---

## API Documentation

### Gateway Routes
```
GET    /products/*          → Product Service
GET    /categories/*        → Product Service  
POST   /api/orders/*        → Order Service
POST   /api/payments/*      → Payment Service
GET    /admin/dlt/*          → DLT Replay Service
```

### Authentication Flow
1. **Login**: `POST /auth/login` → JWT token + refresh token
2. **Register**: `POST /auth/register` → User creation with default USER role
3. **Token Refresh**: Automatic background refresh
4. **Logout**: Token invalidation and Keycloak logout

### Product Management (Admin)
```
GET    /products              → List all products
POST   /products              → Create new product
PUT    /products/{id}         → Update product
DELETE /products/{id}         → Delete product
POST   /products/{id}/image   → Upload product image
```

---

## How to Run (Docker Only)

**Prerequisites**: Docker and Docker Compose installed.

### 1. Quick Start
```bash
git clone <repository-url>
cd micro-e-com
docker-compose up --build
```

### 2. Configure Secrets
Update environment files with your credentials:
- `product-service/.env`: Cloudinary API credentials
- `payment-service/.env`: Razorpay API keys
- `frontend/.env`: External service URLs

### 3. Development Workflow
```bash
# Start infrastructure only
docker-compose up postgres kafka redis mongo keycloak

# Start specific service
docker-compose up product-service --build

# View logs
docker-compose logs -f product-service
```

### 4. Access Points
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Gateway**: [http://localhost:8095](http://localhost:8095)
- **Keycloak Admin**: [http://localhost:8080](http://localhost:8080)

---

## Credentials & Testing

### 1. Keycloak Admin Console
*   **URL**: [http://localhost:8080](http://localhost:8080)
*   **Username**: `admin`
*   **Password**: `admin`
*   **Purpose**: Manage users, roles, and OAuth clients
*   **Setup Guide**: See [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md) for complete configuration

### 2. Application Admin Access
*   **URL**: [http://localhost:5173/login](http://localhost:5173/login)
*   **Username**: `admin1`
*   **Password**: `admin123`
*   **Capabilities**: Access Admin Dashboard, Add/Edit/Delete Products.
*   **Note**: User must be created in Keycloak with ADMIN role (see setup guide)

### 3. Customer Access
*   **Sign Up**: [http://localhost:5173/signup](http://localhost:5173/signup)
*   **Login**: Use your created credentials.
*   **Capabilities**: Browse products, Add to Cart, Checkout.
*   **Note**: New users are automatically assigned USER role in Keycloak

### 4. Test Users
- **Admin**: `admin1/admin123`
- **User**: `santosh@yopmail.com/Password#123`

---

## Development Guidelines

### Code Structure
```
micro-e-com/
├── api-gateway/           # Spring Cloud Gateway
├── auth-microservice/     # Authentication facade
├── product-service/       # Product catalog management
├── order-service/         # Order processing & sagas
├── payment-service/       # Razorpay integration
├── notification-service/  # Event-driven notifications
├── dlt-replay-service/    # Failed event handling
├── frontend/              # React + TypeScript UI
├── README.md              # General Readme file
└── KEYCLOAK_SETUP.md      # Authentication setup guide
```

### Environment Variables
Each service uses environment-specific configuration:
- **Development**: `.env` files in service directories
- **Production**: Docker environment variables
- **Secrets**: Never commit to version control

### Testing Strategy
- **Unit Tests**: Service layer testing with JUnit
- **Integration Tests**: API testing with TestContainers
- **E2E Tests**: Frontend user flow testing
- **Load Testing**: Kafka event throughput testing

---

## Production Deployment

### Docker Production Setup
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 3
  
  api-gateway:
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    deploy:
      replicas: 2
```

### Monitoring & Observability
- **Health Checks**: `/actuator/health` endpoints
- **Metrics**: Prometheus integration via Actuator
- **Logging**: Structured JSON logging
- **Tracing**: Distributed tracing with Spring Cloud Sleuth

### Scaling Considerations
- **Stateless Services**: All services designed for horizontal scaling
- **Database Pooling**: Connection pooling for high throughput
- **Kafka Partitions**: Event distribution across instances
- **Redis Clustering**: Session replication

---

**Note**: This project demonstrates a production-ready architecture. Ensure your `.env` files are correctly populated for full functionality.

---

### Created users for testing :
- **Admin**: `admin1/admin123`
- **User**: `santosh@yopmail.com/Password#123`

---

## License
This project is licensed under the MIT License © 2026 Aaditya B Chatterjee

---

## Pending main task
- order history (with delivery status, pagination) & status updation by admin
- user profile image upload & mobile number update
- wishlist
- ratings & feedback
- cancellation & refund