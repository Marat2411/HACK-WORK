# frontend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

# Создаем символическую ссылку для nginx
RUN mkdir -p /app/WEBSITE && ln -sf /app/staticfiles /app/WEBSITE/static

EXPOSE 8000

CMD ["gunicorn", "hackwork.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]