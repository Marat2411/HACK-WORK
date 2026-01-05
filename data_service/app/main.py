import json
import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI(title="Data Service", version="1.0.0")

DATA_FILE = os.getenv("DATA_FILE_PATH", "/app/data/database.json")

# Модели данных
class User(BaseModel):
    id: str
    username: str
    email: str
    phone: str
    city: str
    telegram: Optional[str] = None
    avatar_url: Optional[str] = None
    balance: float = 0.0
    created_at: str

class Order(BaseModel):
    id: str
    title: str
    description: str
    price: float
    category: str
    location: str
    deadline: str
    phone: str
    image_url: Optional[str] = None
    customer_id: str
    executor_id: Optional[str] = None
    status: str = "active"  # active, in_progress, completed, cancelled
    created_at: str
    updated_at: str

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"users": [], "orders": []}
    
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    Path(DATA_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Users endpoints
@app.get("/api/users")
def get_users():
    data = load_data()
    return data.get("users", [])

@app.get("/api/users/{user_id}")
def get_user(user_id: str):
    data = load_data()
    users = data.get("users", [])
    
    for user in users:
        if user["id"] == user_id:
            return user
    
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/api/users")
def create_user(user: User):
    data = load_data()
    user.id = str(uuid.uuid4())
    user.created_at = datetime.now().isoformat()
    
    data["users"].append(user.dict())
    save_data(data)
    
    return user

# Orders endpoints
@app.get("/api/orders")
def get_orders(status: Optional[str] = None):
    data = load_data()
    orders = data.get("orders", [])
    
    if status:
        orders = [order for order in orders if order["status"] == status]
    
    return orders

@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    data = load_data()
    orders = data.get("orders", [])
    
    for order in orders:
        if order["id"] == order_id:
            return order
    
    raise HTTPException(status_code=404, detail="Order not found")

@app.post("/api/orders")
def create_order(order: Order):
    data = load_data()
    order.id = str(uuid.uuid4())
    order.created_at = datetime.now().isoformat()
    order.updated_at = datetime.now().isoformat()
    
    data["orders"].append(order.dict())
    save_data(data)
    
    return order

@app.put("/api/orders/{order_id}")
def update_order(order_id: str, order_update: dict):
    data = load_data()
    orders = data.get("orders", [])
    
    for i, order in enumerate(orders):
        if order["id"] == order_id:
            order.update(order_update)
            order["updated_at"] = datetime.now().isoformat()
            orders[i] = order
            data["orders"] = orders
            save_data(data)
            return order
    
    raise HTTPException(status_code=404, detail="Order not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)