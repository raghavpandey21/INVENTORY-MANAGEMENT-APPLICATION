from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, field_validator


class ProductBase(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int = 0

    @field_validator("price")
    @classmethod
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be greater than 0")
        return v

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_non_negative(cls, v):
        if v < 0:
            raise ValueError("Quantity must be greater than or equal to 0")
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be greater than 0")
        return v


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    subtotal: float

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    total_amount: float
    created_at: datetime
    items: List[OrderItemResponse]

    model_config = {"from_attributes": True}
