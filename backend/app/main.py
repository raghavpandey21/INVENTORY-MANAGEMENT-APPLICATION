from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import products as products_router
from .routers import customers as customers_router
from .routers import orders as orders_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Inventory & Order Management API",
    version="1.0.0",
    description="Full-stack inventory system",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router.router, prefix="/products")
app.include_router(customers_router.router, prefix="/customers")
app.include_router(orders_router.router, prefix="/orders")


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is healthy"}


@app.get("/")
def root():
    return {"message": "Inventory & Order Management API is running", "docs": "/docs"}
