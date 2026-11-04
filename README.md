## Câu 4: Xây dựng Frontend bằng React

### 1. Công nghệ sử dụng

- React
- Vite
- JavaScript
- CSS
- Fetch API

### 2. Chức năng giao diện

- Hiển thị danh sách thiết bị gồm mã thiết bị, tên, loại thiết bị, phòng học, số lượng và tình trạng.
- Xem chi tiết thông tin thiết bị.
- Thêm thiết bị mới.
- Cập nhật thông tin thiết bị.
- Xóa thiết bị.
- Tìm kiếm thiết bị theo từ khóa.
- Theo dõi tình trạng thiết bị: Đang sử dụng, Hư hỏng, Đang sửa chữa, Ngừng sử dụng.
- Hiển thị trạng thái đang tải dữ liệu.
- Hiển thị thông báo lỗi và kết quả thao tác.

### 3. Cấu hình địa chỉ Backend API

Frontend sử dụng biến môi trường `VITE_API_URL` để cấu hình địa chỉ Backend.

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const API_URL = `${API_BASE_URL}/api/devices`;
```

### 4. Cài đặt và chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Truy cập giao diện tại địa chỉ Vite hiển thị trong terminal, thường là:

http://localhost:5173

### 5. Kiểm tra giao diện

Frontend kết nối Backend API và hiển thị danh sách 3 thiết bị được lưu trong MongoDB Atlas.

Đã kiểm tra các chức năng hiển thị và quản lý thiết bị trên giao diện.
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

Backend kết nối MongoDB Atlas và cung cấp API quản lý thiết bị.

### 5. Push Image lên Docker Hub

```bash
docker tag device-backend s237069/backend:1.0
docker push s237069/backend:1.0
```

**Lưu ý:** File `.env` chứa thông tin kết nối MongoDB và không được đưa lên GitHub hoặc Docker Hub.

---

## Câu 6: Dockerize Frontend

### 1. Docker Image

- Docker Hub Repository: https://hub.docker.com/r/s237069/frontend
- Image: `s237069/frontend:1.0`

### 2. Build Docker Image

```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:5001 -t device-frontend .
```

### 3. Chạy Docker Container

```bash
docker run -d --name device-frontend -p 8080:80 device-frontend
```

### 4. Kiểm tra Frontend

- Frontend: http://localhost:8080
- Backend API: http://localhost:5001/api/devices
- Backend Health check: http://localhost:5001/health

Frontend được triển khai bằng Nginx và kết nối với Backend API.

Kết quả kiểm tra: Giao diện hiển thị danh sách 3 thiết bị lấy từ MongoDB Atlas.

### 5. Push Image lên Docker Hub

```bash
docker tag device-frontend s237069/frontend:1.0
docker push s237069/frontend:1.0
```

### 6. Docker Hub Images

- Backend: https://hub.docker.com/r/s237069/backend
- Frontend: https://hub.docker.com/r/s237069/frontend

**Lưu ý:** `VITE_API_URL` được thiết lập khi build Frontend. Khi triển khai lên Render, cần build lại Frontend với URL Backend công khai thay cho `http://localhost:5001`.