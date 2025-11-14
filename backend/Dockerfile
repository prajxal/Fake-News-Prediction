# Use a slim python base
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# default port for container (override if you want)
ENV PORT=8080
WORKDIR /app

# Copy requirements first for caching
COPY backend/requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy backend code
COPY backend/ ./backend
WORKDIR /app/backend

# Expose port
EXPOSE ${PORT}

# Run with gunicorn; change "app:app" if your module/app object differs
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080", "--workers", "2"]
