# 🚀 Hegemony Companion App - Deployment Guide

Complete guide for deploying the Hegemony Companion App from GitHub Container Registry (GHCR) to various platforms.

> **Image Repository:** `ghcr.io/sinimus/hegemony-companion-app:latest`

---

## 📋 Prerequisites

- Docker or Docker-compatible runtime
- Access to `ghcr.io/sinimus/hegemony-companion-app:latest`
- Port `3000` available (or custom port mapping)

---

## 🐳 Quick Start (Any Platform)

```bash
# Pull the image
docker pull ghcr.io/sinimus/hegemony-companion-app:latest

# Run the container
docker run -d \
  --name hegemony-companion \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/sinimus/hegemony-companion-app:latest
```

Access at: `http://localhost:3000`

---

## 🏠 Home Lab & Local Docker

### **Option 1: Docker Desktop (Windows/Mac/Linux)**
```bash
# Run with volume for persistent data (optional)
docker run -d \
  --name hegemony-companion \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/sinimus/hegemony-companion-app:latest
```

### **Option 2: Docker Compose**
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  hegemony-companion:
    image: ghcr.io/sinimus/hegemony-companion-app:latest
    container_name: hegemony-companion
    ports:
      - "3000:3000"
    restart: unless-stopped
    # Optional: Add custom domain or reverse proxy
    environment:
      - NODE_ENV=production
```

Run: `docker-compose up -d`

### **Option 3: With Watchtower (Auto-updates)**
```yaml
version: '3.8'

services:
  hegemony-companion:
    image: ghcr.io/sinimus/hegemony-companion-app:latest
    container_name: hegemony-companion
    ports:
      - "3000:3000"
    restart: unless-stopped
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

  watchtower:
    image: containrrr/watchtower
    container_name: watchtower-hegemony
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 3600 --cleanup
    restart: unless-stopped
```

---

## 🖥️ Unraid + Portainer

### **Method 1: Portainer UI (Recommended)**
1. **Open Portainer** from Unraid dashboard
2. Go to **"Stacks"** → **"+ Add stack"**
3. **Stack name:** `hegemony-companion`
4. **Webhook:** Enable automatic redeployment (optional)
5. **Compose file:**
```yaml
version: '3.8'

services:
  hegemony-companion:
    image: ghcr.io/sinimus/hegemony-companion-app:latest
    container_name: hegemony-companion
    ports:
      - "3000:3000"
    restart: unless-stopped
    pull_policy: always
```

### **Method 2: Portainer Container**
1. Go to **"Containers"** → **"+ Add container"**
2. **Image:** `ghcr.io/sinimus/hegemony-companion-app:latest`
3. **Name:** `hegemony-companion`
4. **Ports:** `3000:3000`
5. **Restart policy:** `Unless stopped`
6. **Pull policy:** `Always`

### **Method 3: Manual Docker CLI in Unraid Terminal**
```bash
# SSH into your Unraid server
docker pull ghcr.io/sinimus/hegemony-companion-app:latest
docker run -d \
  --name hegemony-companion \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/sinimus/hegemony-companion-app:latest
```

### **🔄 Automatic Updates with Webhooks**
1. **Enable Portainer Webhooks** → Settings → Webhooks
2. **Create stack with webhook** enabled
3. **Add webhook URL** to GitHub Actions (see GitHub Webhook section below)

---

## ☁️ Cloud VPS & Managed Docker Platforms

### **DigitalOcean App Platform**
```bash
# Create app with Docker image
doctl apps create --spec '{
  "name": "hegemony-companion",
  "services": [{
    "name": "web",
    "source_dir": "/",
    "github": {
      "repo": "Sinimus/hegemony-companion-app",
      "branch": "main"
    },
    "run_command": "docker run -p 8080:3000 ghcr.io/sinimus/hegemony-companion-app:latest",
    "http_port": 8080
  }]
}'
```

### **AWS ECS (Elastic Container Service)**
```bash
# Create ECS task definition
aws ecs register-task-definition --cli-input-json '{
  "family": "hegemony-companion",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [{
    "name": "hegemony-companion",
    "image": "ghcr.io/sinimus/hegemony-companion-app:latest",
    "portMappings": [{"containerPort": 3000}],
    "essential": true
  }]
}'
```

### **Google Cloud Run**
```bash
# Deploy to Cloud Run
gcloud run deploy hegemony-companion \
  --image ghcr.io/sinimus/hegemony-companion-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

### **Azure Container Instances**
```bash
# Create container instance
az container create \
  --resource-group hegemony-rg \
  --name hegemony-companion \
  --image ghcr.io/sinimus/hegemony-companion-app:latest \
  --ports 3000 \
  --dns-name-label hegemony-companion-unique
```

---

## 🛠️ Coolify & Self-Hosted Platforms

### **Coolify Deployment**
1. **Add Server** in Coolify dashboard
2. **Create New Application** → **Docker**
3. **Image:** `ghcr.io/sinimus/hegemony-companion-app:latest`
4. **Port:** `3000`
5. **Domain:** Optional (add your domain)
6. **Deploy**

### **Plesk Panel**
1. **Docker** → **Create Container**
2. **Image:** `ghcr.io/sinimus/hegemony-companion-app:latest`
3. **Port Mapping:** `3000:3000`
4. **Restart Policy:** Always

### **cPanel**
```bash
# Via SSH in cPanel
docker run -d \
  --name hegemony-companion \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/sinimus/hegemony-companion-app:latest
```

---

## 🔧 Kubernetes Deployments

### **Minikube (Local)**
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hegemony-companion
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hegemony-companion
  template:
    metadata:
      labels:
        app: hegemony-companion
    spec:
      containers:
      - name: hegemony-companion
        image: ghcr.io/sinimus/hegemony-companion-app:latest
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: hegemony-companion-service
spec:
  selector:
    app: hegemony-companion
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

```bash
kubectl apply -f k8s-deployment.yaml
minikube service hegemony-companion-service
```

### **Production Kubernetes**
```bash
# With Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install hegemony-companion bitnami/nginx \
  --set image.repository=ghcr.io/sinimus/hegemony-companion-app \
  --set image.tag=latest \
  --set service.port=3000
```

---

## 🔄 GitHub Actions Webhook for Auto-Deploy

### **Update GitHub Actions Workflow**
Add webhook trigger to your `.github/workflows/docker-build.yml`:

```yaml
# After Docker build step
- name: Trigger Auto-Deploy
  run: |
    # Portainer webhook (if using Portainer)
    curl -X POST "${{ secrets.PORTAINER_WEBHOOK_URL }}" \
      -H "Content-Type: application/json" \
      -d '{"repository": "${{ github.repository }}", "tag": "latest"}' \
      || echo "Portainer webhook sent"

    # Custom webhook (for other platforms)
    curl -X POST "${{ secrets.DEPLOY_WEBHOOK_URL }}" \
      -H "Content-Type: application/json" \
      -d '{"action": "deploy", "image": "ghcr.io/sinimus/hegemony-companion-app:latest"}' \
      || echo "Deploy webhook sent"
```

### **Required GitHub Secrets**
- `PORTAINER_WEBHOOK_URL`: Your Portainer webhook URL
- `DEPLOY_WEBHOOK_URL`: Custom deployment webhook URL

---

## 🔍 Environment Variables

The app works out of the box, but you can customize:

```bash
# Optional environment variables
docker run -d \
  --name hegemony-companion \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  ghcr.io/sinimus/hegemony-companion-app:latest
```

---

## 📊 Monitoring & Health Checks

### **Health Check Endpoint**
The app serves static files, so any 200 response indicates health:

```bash
# Health check
curl -f http://localhost:3000 || echo "App not responding"

# Container health
docker inspect hegemony-companion --format='{{.State.Status}}'
```

### **Docker Health Check**
```bash
docker run -d \
  --name hegemony-companion \
  -p 3000:3000 \
  --health-cmd="curl -f http://localhost:3000 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  ghcr.io/sinimus/hegemony-companion-app:latest
```

---

## 🆘 Troubleshooting

### **Common Issues**

#### **Port Already in Use**
```bash
# Find what's using port 3000
lsof -i :3000
# Or use different port
docker run -d -p 8080:3000 hegemony-companion
```

#### **Image Pull Issues**
```bash
# Check if you can access GHCR
docker pull ghcr.io/sinimus/hegemony-companion-app:latest

# If authentication required
docker login ghcr.io
```

#### **Container Not Starting**
```bash
# Check logs
docker logs hegemony-companion

# Check container status
docker ps -a
```

### **Platform-Specific Tips**

#### **Unraid**
- Use **Bridge** network mode for simplicity
- Check **Docker settings** → **Enable Docker**
- Verify **Portainer** is running on port 9443

#### **Windows Docker Desktop**
- Enable **WSL 2 integration**
- Check if port 3000 is available in Windows Firewall
- Use PowerShell or Command Prompt for Docker commands

#### **macOS**
- Ensure **Docker Desktop** is running
- Check port availability: `lsof -i :3000`
- Use **localhost:3000** or `127.0.0.1:3000`

---

## 🔗 Access URLs

After successful deployment:

| Platform | Access URL |
|----------|------------|
| Local Docker | `http://localhost:3000` |
| Unraid | `http://your-unraid-ip:3000` |
| Cloud Run | `https://your-app-url.a.run.app` |
| DigitalOcean | `https://your-app-name.on.digitalocean.app.com` |
| Kubernetes | `http://external-ip:port` |

---

## 📈 Scaling & Production Tips

### **Production Considerations**
- **Load Balancer**: For high availability
- **CDN**: CloudFlare for static asset caching
- **SSL**: Let's Encrypt or cloud provider SSL
- **Monitoring**: Prometheus + Grafana
- **Backup**: GitHub Actions already backups code

### **Resource Requirements**
- **CPU**: Minimal (static files)
- **Memory**: ~64MB RAM
- **Storage**: ~50MB disk space
- **Network**: Low bandwidth

---

## 🚀 Quick Deploy Summary

```bash
# One-command deployment (Linux/macOS)
docker run -d \
  --name hegemony-companion \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/sinimus/hegemony-companion-app:latest && \
echo "🎉 Hegemony Companion deployed! Visit http://localhost:3000"
```

---

**🎯 That's it!** Your Hegemony Companion App is now deployed and ready to help players conquer the economic battlefield! 🏛️📊

For support, visit the [GitHub repository](https://github.com/Sinimus/hegemony-companion-app) or contact [Lukáš Walek](mailto:l.walek@proton.me).