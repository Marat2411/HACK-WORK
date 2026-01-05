FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir fastapi uvicorn

COPY app/ ./app/

EXPOSE 8003

CMD ["python", "app/main.py"]