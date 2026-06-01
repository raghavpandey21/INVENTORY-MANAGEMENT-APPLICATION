# InventoryPro - Inventory & Order Management System

A full-stack inventory management application built with FastAPI, React, and PostgreSQL.

## Features

- **Product Management** - CRUD operations with SKU uniqueness enforcement
- **Customer Management** - Customer profiles with unique email validation
- **Order Management** - Create orders with stock validation, automatic stock deduction, and order cancellation with stock restoration
- **Dashboard** - Real-time overview with key metrics, low stock alerts, and recent orders
- **Docker Support** - One-command deployment with Docker Compose

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11, FastAPI, SQLAlchemy, Pydantic v2, Uvicorn |
| Frontend | React 18, Vite, React Router v6, Axios, TailwindCSS, lucide-react |
| Database | PostgreSQL 15 |
| Containers | Docker, Docker Compose |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd inventory-system
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Start the application:
   ```bash
   docker-compose up --build
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/` | Create a new product |
| GET | `/products/` | List all products |
| GET | `/products/{id}` | Get product by ID |
| PUT | `/products/{id}` | Update a product |
| DELETE | `/products/{id}` | Delete a product |
| POST | `/customers/` | Create a new customer |
| GET | `/customers/` | List all customers |
| GET | `/customers/{id}` | Get customer by ID |
| DELETE | `/customers/{id}` | Delete a customer |
| POST | `/orders/` | Create a new order |
| GET | `/orders/` | List all orders |
| GET | `/orders/{id}` | Get order by ID |
| DELETE | `/orders/{id}` | Cancel an order |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | admin |
| `POSTGRES_PASSWORD` | PostgreSQL password | strongpassword123 |
| `POSTGRES_DB` | PostgreSQL database name | inventory_db |
| `DATABASE_URL` | Full database connection string | postgresql://admin:strongpassword123@db:5432/inventory_db |
| `VITE_API_URL` | Backend API URL for frontend | http://localhost:8000 |

## Deployment

### Backend (Render)

1. Push the backend directory to a Git repository
2. Create a new Web Service on Render
3. Set the build command: `pip install -r requirements.txt`
4. Set the start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
5. Add all required environment variables
6. Deploy

### Frontend (Vercel)

1. Push the frontend directory to a Git repository
2. Import the project in Vercel
3. Set `VITE_API_URL` environment variable to the deployed backend URL
4. Deploy

## Business Rules

1. **Duplicate SKU**: Products must have unique SKUs (409 Conflict)
2. **Duplicate Email**: Customers must have unique emails (409 Conflict)
3. **Stock Validation**: Orders cannot exceed available stock (400 Bad Request)
4. **Stock Deduction**: Creating an order automatically deducts stock
5. **Stock Restoration**: Cancelling an order restores all stock quantities
6. **Server-side Calculation**: Order totals are calculated server-side; client-submitted totals are never trusted
