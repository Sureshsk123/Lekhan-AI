# LangSphere AI — Production Deployment Guide

This guide covers step-by-step instructions for deploying **LangSphere AI** to production servers using Docker, Nginx, PM2, and managed PostgreSQL databases.

---

## 🏗️ Production Architecture Overview

```
               [ User Browser / Mobile ]
                          │
                   HTTPS (Port 443)
                          ▼
                    [ Nginx / CDN ]
           ┌──────────────┴──────────────┐
           ▼                             ▼
   [ Static Frontend ]          [ Express API Server ]
    (Vite Dist Build)            (Node.js / PM2 / Port 5005)
                                         │
                                 ┌───────┴───────┐
                                 ▼               ▼
                           [ PostgreSQL ]    [ Gemini AI ]
```

---

## 📦 1. Database Setup (PostgreSQL)

Deploy PostgreSQL v14+ via AWS RDS, DigitalOcean Managed Database, or Docker.

### Database Initialization
1. Create a database named `langsphere_db`.
2. Ensure connection parameters are secured with SSL in production:
   ```env
   DATABASE_URL="postgresql://user:secure_password@db.example.com:5432/langsphere_db?sslmode=require"
   ```

---

## ⚙️ 2. Backend API Deployment (Node.js + Express)

### Environment Variables (`.env`)
Create `.env` inside `backend-ts/`:
```env
NODE_ENV="production"
PORT=5005
DATABASE_URL="postgresql://user:password@db.example.com:5432/langsphere_db?sslmode=require"
JWT_SECRET="your_extremely_long_production_jwt_secret"
GEMINI_API_KEY="your_production_google_gemini_api_key"
```

### Installation & Build
```bash
cd backend-ts
npm install --production=false
npx prisma db push
npx prisma generate
npx tsx prisma/seed.ts
npm run build
```

### PM2 Process Manager
Install PM2 globally and start backend cluster:
```bash
npm install -g pm2
pm2 start dist/server.js --name "langsphere-api" -i max
pm2 save
pm2 startup
```

---

## 🎨 3. Frontend Deployment (React + Vite)

### Build Static Assets
Set environment variable for production API endpoint during build:
```bash
cd /path/to/learning-problem-4
VITE_API_URL="https://api.langsphere.example.com/api" npm run build
```
This generates optimized static files inside `dist/`.

### Serving Static Files via Nginx
Configure `/etc/nginx/sites-available/langsphere`:
```nginx
server {
    listen 80;
    server_name langsphere.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name langsphere.example.com;

    ssl_certificate /etc/letsencrypt/live/langsphere.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/langsphere.example.com/privkey.pem;

    root /var/www/langsphere/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🐳 4. Docker Deployment Alternative

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: langsphere_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend-ts
    ports:
      - "5005:5005"
    environment:
      DATABASE_URL: "postgresql://postgres:postgrespassword@db:5432/langsphere_db"
      JWT_SECRET: "docker_production_jwt_secret"
      GEMINI_API_KEY: "${GEMINI_API_KEY}"
      PORT: 5005
    depends_on:
      - db

volumes:
  pgdata:
```

Run containers:
```bash
docker-compose up -d --build
```
