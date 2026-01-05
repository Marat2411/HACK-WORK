FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir fastapi uvicorn pydantic

COPY app/ ./app/

EXPOSE 8001

CMD ["python", "app/main.py"]