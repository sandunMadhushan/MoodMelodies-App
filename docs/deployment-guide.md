# Production Deployment Guide

## Option 1: Heroku Deployment

### 1. Install Heroku CLI

```bash
# Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Prepare for deployment

```bash
cd face-api-service

# Create Procfile
echo "web: node server.js" > Procfile

# Update package.json with proper start script
npm pkg set scripts.start="node server.js"

# Initialize git repository
git init
git add .
git commit -m "Initial commit"
```

### 3. Deploy to Heroku

```bash
# Create Heroku app
heroku create your-face-api-app-name

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Get your app URL
heroku info
```

### 4. Update mobile app configuration

Update `API_BASE_URL` in your mobile app:

```typescript
private readonly API_BASE_URL = 'https://your-face-api-app-name.herokuapp.com';
```

## Option 2: Vercel Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Create vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 3. Deploy

```bash
cd face-api-service
vercel
```

## Option 3: Railway Deployment

### 1. Connect to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## Option 4: AWS Lambda (Serverless)

Use AWS Lambda with API Gateway for serverless deployment.

## Option 5: Self-hosted VPS

Deploy on any cloud provider (DigitalOcean, Linode, etc.) using Docker:

### Dockerfile

```dockerfile
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD ["npm", "start"]
```

### Deploy commands

```bash
docker build -t face-api-service .
docker run -p 3001:3001 face-api-service
```
