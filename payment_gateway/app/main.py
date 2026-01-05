from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Payment Gateway", version="1.0.0")

class PaymentRequest(BaseModel):
    amount: float
    user_id: str
    order_id: str
    description: str

@app.get("/")
def read_root():
    return {"service": "Payment Gateway", "status": "running"}

@app.post("/api/payment/create")
def create_payment(payment: PaymentRequest):
    # Заглушка - в реальности здесь интеграция с платежной системой
    return {
        "payment_id": "mock_payment_12345",
        "status": "created",
        "amount": payment.amount,
        "payment_url": "https://mock-payment.example.com/pay/mock_payment_12345"
    }

@app.get("/api/payment/{payment_id}/status")
def check_payment(payment_id: str):
    return {
        "payment_id": payment_id,
        "status": "completed",
        "amount": 1000.0
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "payment_gateway"}

# Добавьте эту часть для запуска через python app/main.py
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)