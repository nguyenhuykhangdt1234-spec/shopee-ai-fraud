# HƯỚNG DẪN KẾT NỐI MICROSOFT SQL SERVER CHO SHOPEE AI FRAUD SHIELD

Hệ thống được thiết kế theo mô hình **3 lớp (3-Tier Architecture)**:
`Giao Diện Web (HTML/JS) ⟷ Backend Server (Node.js Express) ⟷ Microsoft SQL Server`

---

## BƯỚC 1: TẠO CƠ SỞ DỮ LIỆU TRONG SSMS

1. Mở phần mềm **SQL Server Management Studio (SSMS)** trên máy tính của bạn.
2. Đăng nhập vào Server của bạn (ví dụ: `.\MSSQLSERVER01` hoặc `localhost` với tài khoản `sa` hoặc `Windows Authentication`).
3. Bấm nút **New Query** (hoặc nhấn `Ctrl + N`).
4. Mở file `schema.sql` (hoặc copy toàn bộ nội dung file [schema.sql](file:///C:/Users/LENOVO/OneDrive/Desktop/shopee-ai-fraud-chatbot/schema.sql) dán vào cửa sổ truy vấn).
5. Nhấn **Execute** (hoặc phím `F5`).
   * Kết quả: CSDL `ShopeeFraudShieldDB` được tạo tự động cùng 4 bảng: `Customers`, `Orders`, `RefundRequests`, `AuditLogs` và nạp sẵn 5 kịch bản kiểm thử.

---

## BƯỚC 2: CẤU HÌNH THÔNG TIN KẾT NỐI TRONG `server.js`

Mở file `server.js` và chỉnh sửa thông tin trong mục `dbConfig`:

```javascript
const dbConfig = {
  user: 'sa',                           // Tên tài khoản SQL Server của bạn (mặc định sa)
  password: 'mat_khau_cua_ban_o_day',   // Mật khẩu sa bạn đặt khi cài SQL Server
  server: 'localhost\\MSSQLSERVER01',   // Tên Server Instance của bạn
  database: 'ShopeeFraudShieldDB',      // CSDL vừa tạo ở Bước 1
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};
```

---

## BƯỚC 3: CÀI ĐẶT THƯ VIỆN & CHẠY SERVER

Mở **PowerShell** hoặc **Terminal** trong thư mục dự án:

```powershell
cd C:\Users\LENOVO\OneDrive\Desktop\shopee-ai-fraud-chatbot

# 1. Cài đặt các thư viện cần thiết
npm install

# 2. Khởi động máy chủ kết nối CSDL
npm start
```

Khi màn hình hiện:
```
✅ ĐÃ KẾT NỐI THÀNH CÔNG VỚI MICROSOFT SQL SERVER (ShopeeFraudShieldDB)!
🚀 SHOPEE AI FRAUD SHIELD SERVER ĐANG CHẠY TẠI: http://localhost:3000
```
Bạn chỉ cần mở trình duyệt vào địa chỉ **`http://localhost:3000`** là toàn bộ dữ liệu sẽ được đọc và ghi trực tiếp vào Microsoft SQL Server!

---

## BƯỚC 4: CÁC CÂU LỆNH SQL DÙNG ĐỂ CHỤP ẢNH BÁO CÁO / THUYẾT TRÌNH

### 1. Truy vấn danh sách hồ sơ khiếu nại và điểm rủi ro AI:
```sql
USE ShopeeFraudShieldDB;
SELECT 
    r.RequestId, 
    c.FullName, 
    c.Tier, 
    o.ProductName, 
    o.PriceFormatted, 
    r.RiskScore, 
    r.RiskLevel, 
    r.Status 
FROM dbo.RefundRequests r
JOIN dbo.Orders o ON r.OrderId = o.OrderId
JOIN dbo.Customers c ON r.CustomerId = c.CustomerId;
```

### 2. Xem lịch sử thẩm định của chuyên viên CSKH:
```sql
SELECT 
    a.LogId, 
    r.OrderId, 
    a.StaffName, 
    a.StaffAction, 
    a.StaffNote, 
    a.CreatedAt 
FROM dbo.AuditLogs a
JOIN dbo.RefundRequests r ON a.RequestId = r.RequestId;
```
