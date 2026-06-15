# Production Dockerfile - Multi-service build
# This Dockerfile is for production deployments
# For local development, use: docker-compose up

FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --production

COPY backend/src ./src

# Stage 2: Frontend build
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Stage 3: Production runtime
FROM nginx:alpine

# Install Node.js in nginx image for backend
RUN apk add --no-cache nodejs npm

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy backend code
COPY --from=backend-builder /app/backend /app/backend

WORKDIR /app/backend

# Expose both ports
EXPOSE 80 5000

# Start both services
CMD ["sh", "-c", "node src/index.js & nginx -g 'daemon off;'"]
