FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir fastapi uvicorn python-multipart

COPY app/ ./app/

EXPOSE 8002

CMD ["python", "app/main.py"]