# Docker Setup Guide for iMessageBot

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Environment variables configured (see below)

### Development Setup

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   - Add your Clerk API keys
   - Configure MongoDB URI (defaults to local MongoDB)
   - Set CORS origin

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

## File Structure

```
Dockerfile                 - Production multi-service build
docker-compose.yml        - Local development orchestration
.dockerignore            - Files to exclude from Docker builds
backend/
  └─ Dockerfile          - Backend development image
frontend/
  ├─ Dockerfile          - Frontend production image (nginx)
  └─ nginx.conf          - Nginx configuration for SPA routing
```

## Production Deployment

Build the production image:
```bash
docker build -t imessagebot:latest .
```

Run the production container:
```bash
docker run -p 80:80 -p 5000:5000 \
  -e CLERK_SECRET_KEY=your_key \
  -e CLERK_PUBLISHABLE_KEY=your_key \
  -e MONGODB_URI=your_mongo_uri \
  imessagebot:latest
```

## Docker Images Used

- **Backend:** node:20-alpine (lightweight, ~150MB)
- **Frontend:** nginx:alpine (production-optimized, ~40MB)
- **Database:** mongo:7-alpine (database server, ~150MB)

## Features

✅ Multi-stage builds for optimized images
✅ Health checks for all services
✅ Volume mounts for development
✅ Automatic service restart
✅ MongoDB integration
✅ SPA routing with nginx
✅ API proxy configuration
✅ Gzip compression
✅ Production-ready configuration

## Network

All services communicate over the `imessagebot-network` bridge network:
- Frontend can reach backend at `http://backend:5000`
- Backend can reach MongoDB at `mongodb://mongo:27017`

## Troubleshooting

**Services won't start:**
```bash
docker-compose logs
```

**Need to rebuild images:**
```bash
docker-compose build --no-cache
docker-compose up
```

**Clear volumes (fresh database):**
```bash
docker-compose down -v
docker-compose up
```

**Shell into running container:**
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec mongo mongosh
```
