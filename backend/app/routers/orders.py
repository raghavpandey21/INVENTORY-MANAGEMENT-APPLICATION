from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..models import Order, OrderItem, Product, Customer
from ..schemas import OrderCreate, OrderResponse, OrderItemResponse

router = APIRouter(tags=["Orders"])


def build_order_response(order: Order) -> OrderResponse:
    return OrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=order.customer.name,
        total_amount=order.total_amount,
        created_at=order.created_at,
        items=[
            OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                subtotal=item.quantity * item.unit_price,
            )
            for item in order.items
        ],
    )


@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == order_data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.quantity}, Requested: {item.quantity}",
            )

    db_order = Order(customer_id=order_data.customer_id, total_amount=0.0)
    db.add(db_order)
    db.flush()

    total = 0.0
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        unit_price = product.price
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=unit_price,
        )
        db.add(db_item)
        product.quantity -= item.quantity
        total += item.quantity * unit_price

    db_order.total_amount = total
    db.commit()
    db.refresh(db_order)
    order = db.query(Order).options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product)).filter(Order.id == db_order.id).first()
    return build_order_response(order)


@router.get("/", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.created_at.desc())
        .all()
    )
    return [build_order_response(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return build_order_response(order)


@router.delete("/{order_id}")
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    for item in order.items:
        product = item.product
        product.quantity += item.quantity

    for item in order.items:
        db.delete(item)
    db.delete(order)
    db.commit()
    return {"message": "Order cancelled and stock restored"}
