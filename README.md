## Câu 5: Dockerize Backend

### 1. Docker Image

- Docker Hub Repository: https://hub.docker.com/r/s237069/backend
- Image: `s237069/backend:1.0`

### 2. Build Docker Image

```bash
cd backend
docker build -t device-backend .
```

### 3. Chạy Docker Container

```bash
docker run -d --name device-backend -p 5001:5000 --env-file .env device-backend
```

### 4. Kiểm tra Backend

- Health check: http://localhost:5001/health
- API thiết bị: http://localhost:5001/api/devices

### 5. Push Image lên Docker Hub

```bash
docker tag device-backend s237069/backend:1.0
docker push s237069/backend:1.0
```

**Lưu ý:** File `.env` chứa thông tin kết nối MongoDB và không được đưa lên GitHub hoặc Docker Hub.