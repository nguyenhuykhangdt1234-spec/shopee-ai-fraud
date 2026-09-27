-- ============================================================================
-- HỆ THỐNG SHOPEE AI FRAUD SHIELD - CƠ SỞ DỮ LIỆU MICROSOFT SQL SERVER
-- Tác giả: Nhóm Nghiên Cứu Đề Tài Phát Hiện Gian Lận Hoàn Tiền Shopee
-- Hệ quản trị CSDL: Microsoft SQL Server (T-SQL)
-- ============================================================================

-- 1. TẠO CƠ SỞ DỮ LIỆU
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ShopeeFraudShieldDB')
BEGIN
    CREATE DATABASE ShopeeFraudShieldDB;
END
GO

USE ShopeeFraudShieldDB;
GO

-- 2. XÓA CÁC BẢNG NẾU ĐÃ TỒN TẠI (ĐẢM BẢO THỨ TỰ RÀNG BUỘC KHÓA NGOẠI)
IF OBJECT_ID('dbo.AuditLogs', 'U') IS NOT NULL DROP TABLE dbo.AuditLogs;
IF OBJECT_ID('dbo.RefundRequests', 'U') IS NOT NULL DROP TABLE dbo.RefundRequests;
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.Customers', 'U') IS NOT NULL DROP TABLE dbo.Customers;
GO

-- 3. BẢNG 1: KHÁCH HÀNG (Customers)
-- Lưu trữ hồ sơ định danh, lịch sử mua hàng, và đặc trưng hành vi
CREATE TABLE dbo.Customers (
    CustomerId VARCHAR(20) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Tier NVARCHAR(50) NOT NULL,              -- Kim Cương VIP, Vàng, Bạc, Khách Mới
    TotalOrders INT DEFAULT 0,               -- Tổng số đơn đã mua thành công
    RefundCount30Days INT DEFAULT 0,         -- Số lần yêu cầu hoàn tiền trong 30 ngày qua
    RefundRate DECIMAL(5,2) DEFAULT 0.00,    -- Tỷ lệ hoàn tiền lịch sử (%)
    DeviceHash VARCHAR(64) NULL,             -- Mã băm thiết bị (phát hiện Fraud Ring)
    IPAddress VARCHAR(45) NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 4. BẢNG 2: ĐƠN HÀNG (Orders)
-- Lưu trữ thông tin đơn hàng gốc được mua trên Shopee
CREATE TABLE dbo.Orders (
    OrderId VARCHAR(30) PRIMARY KEY,
    CustomerId VARCHAR(20) NOT NULL,
    ProductName NVARCHAR(255) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    PriceFormatted NVARCHAR(50) NOT NULL,
    PurchaseDate DATETIME DEFAULT GETDATE(),
    DeliveryDate DATETIME NULL,
    Status NVARCHAR(50) DEFAULT N'Đã giao hàng',
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId)
);
GO

-- 5. BẢNG 3: YÊU CẦU HOÀN TIỀN & ĐÁNH GIÁ AI (RefundRequests)
-- Lưu trữ khiếu nại, điểm rủi ro AI (Risk Score) và đặc trưng Explainable AI (XAI)
CREATE TABLE dbo.RefundRequests (
    RequestId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId VARCHAR(30) NOT NULL UNIQUE,
    CustomerId VARCHAR(20) NOT NULL,
    Reason NVARCHAR(255) NOT NULL,
    EvidenceImg NVARCHAR(500) NULL,
    EvidenceConfidence NVARCHAR(50) NULL,    -- Độ tin cậy từ Computer Vision
    OrderAnomalyRatio NVARCHAR(50) NULL,     -- Độ lệch giá trị đơn so với lịch sử
    ClaimDelay NVARCHAR(50) NULL,            -- Thời gian từ khi nhận hàng đến khi ấn hoàn
    RiskScore INT NOT NULL,                  -- Điểm rủi ro AI (0 - 100%)
    RiskLevel VARCHAR(20) NOT NULL,          -- 'low', 'medium', 'high', 'critical'
    RiskLabel NVARCHAR(50) NOT NULL,         -- RỦI RO THẤP, TRUNG BÌNH, CAO, FRAUD RING
    DecisionType VARCHAR(50) NOT NULL,       -- 'instant_refund', 'staff_review', 'fraud_freeze'
    AiRecommendation NVARCHAR(255) NOT NULL,
    AiRecommendationDesc NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(50) DEFAULT N'Chờ thẩm định', -- 'Chờ thẩm định', 'Đã duyệt', 'Đã từ chối'
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_RefundRequests_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId),
    CONSTRAINT FK_RefundRequests_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId)
);
GO

-- 6. BẢNG 4: NHẬT KÝ THẨM ĐỊNH NHÂN VIÊN (AuditLogs - Human-in-the-Loop)
-- Lưu vết mọi quyết định của CSKH để nạp vào hệ thống Continuous Learning
CREATE TABLE dbo.AuditLogs (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    StaffName NVARCHAR(100) DEFAULT N'Chuyên viên CSKH Shopee',
    StaffAction NVARCHAR(100) NOT NULL,      -- Phê duyệt hoàn tiền, Yêu cầu bổ sung, Khóa fraud
    StaffNote NVARCHAR(MAX) NULL,            -- Ghi chú thẩm định của chuyên viên
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_AuditLogs_RefundRequests FOREIGN KEY (RequestId) REFERENCES dbo.RefundRequests(RequestId)
);
GO

-- ============================================================================
-- 7. CHÈN DỮ LIỆU MẪU: 5 KỊCH BẢN KIỂM THỬ THỰC TẾ (MỤC 6.1 BÁO CÁO)
-- ============================================================================

-- Khách hàng
INSERT INTO dbo.Customers (CustomerId, FullName, Tier, TotalOrders, RefundCount30Days, RefundRate, DeviceHash, IPAddress) VALUES
('CUST-8812', N'Hoàng Nam', N'Kim Cương VIP', 45, 0, 2.20, 'a1b2c3d4e5_vip', '14.232.208.10'),
('CUST-4109', N'Nguyễn Văn B', N'Khách Hàng Vàng', 18, 1, 5.50, 'f6g7h8i9j0_gold', '113.161.72.45'),
('CUST-9921', N'Trần Thị C', N'Khách Hàng Bạc', 12, 4, 33.30, 'k1l2m3n4o5_silver', '42.112.35.89'),
('CUST-6604', N'Lê Văn D (Gian Lận)', N'Khách Hàng Mới', 2, 5, 85.00, 'SHARED_DEVICE_RING_99', '171.244.10.12'),
('CUST-1033', N'Phạm Thu Hà', N'Khách Hàng Mới (Cold-Start)', 1, 0, 0.00, 'new_user_uuid_1033', '27.72.100.5');
GO

-- Đơn hàng
INSERT INTO dbo.Orders (OrderId, CustomerId, ProductName, Price, PriceFormatted, PurchaseDate, DeliveryDate, Status) VALUES
('ORD-98234', 'CUST-8812', N'Áo Thun Nam Cotton Shopee Choice', 149000, N'₫149,000', DATEADD(DAY, -2, GETDATE()), DATEADD(HOUR, -2, GETDATE()), N'Đã giao hàng'),
('ORD-88121', 'CUST-4109', N'Giày Thể Thao Nam Sneaker Runner', 680000, N'₫680,000', DATEADD(DAY, -3, GETDATE()), DATEADD(DAY, -1, GETDATE()), N'Đã giao hàng'),
('ORD-77412', 'CUST-9921', N'Tai Nghe Chống Ồn Bluetooth Pro ANC', 1450000, N'₫1,450,000', DATEADD(DAY, -5, GETDATE()), DATEADD(DAY, -2, GETDATE()), N'Đã giao hàng'),
('ORD-33109', 'CUST-6604', N'Điện Thoại Thông Minh Flagship Pro Max', 24990000, N'₫24,990,000', DATEADD(DAY, -1, GETDATE()), DATEADD(HOUR, -4, GETDATE()), N'Đã giao hàng'),
('ORD-11029', 'CUST-1033', N'Bộ Serum Dưỡng Da Cấp Ẩm Phục Hồi', 420000, N'₫420,000', DATEADD(DAY, -4, GETDATE()), DATEADD(DAY, -2, GETDATE()), N'Đã giao hàng');
GO

-- Yêu cầu hoàn tiền & Đánh giá AI
INSERT INTO dbo.RefundRequests 
(OrderId, CustomerId, Reason, EvidenceImg, EvidenceConfidence, OrderAnomalyRatio, ClaimDelay, RiskScore, RiskLevel, RiskLabel, DecisionType, AiRecommendation, AiRecommendationDesc, Status) 
VALUES
('ORD-98234', 'CUST-8812', N'Áo bị rách đường may ở cánh tay khi mở gói', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300', N'Rất cao (94%)', N'1.0x (Chuẩn)', N'2 giờ', 12, 'low', N'RỦI RO THẤP', 'instant_refund', N'Tự động phê duyệt hoàn tiền ngay (Instant Refund)', N'Khách hàng VIP có độ tin cậy cao, tỷ lệ hoàn tiền 2.2% rất thấp, đơn giá trị nhỏ. Tự động duyệt hoàn tiền về ví ShopeePay không cần hoàn trả hàng.', N'Đã tự động duyệt'),

('ORD-88121', 'CUST-4109', N'Giao nhầm màu và sai kích thước (đặt size 42 giao size 40)', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', N'Trung bình (68%)', N'1.2x (Bình thường)', N'1 ngày', 38, 'medium', N'RỦI RO TRUNG BÌNH', 'staff_review', N'Yêu cầu cung cấp video mở hộp / CSKH duyệt', N'Có ảnh chụp hộp giày nhưng thiếu video unboxing chuẩn xác để đối soát tem mã vận đơn của bưu tá. Đề xuất hệ thống yêu cầu bổ sung video.', N'Chờ thẩm định'),

('ORD-77412', 'CUST-9921', N'Tai nghe rè 1 bên tai, không kết nối được Bluetooth', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', N'Thấp (30% - Không rõ lỗi)', N'3.8x (Đơn giá trị cao)', N'2 ngày', 74, 'high', N'RỦI RO CAO', 'staff_review', N'Chuyển chuyên viên CSKH thẩm định & Thu hồi hàng', N'Khách có tần suất hoàn tiền cao bất thường (4 lần / 30 ngày, chiếm 33.3% lịch sử), giá trị đơn gấp 3.8 lần đơn trung bình. Cần thu hồi sản phẩm về kho Shopee kiểm tra kỹ thuật trước khi hoàn tiền.', N'Chờ thẩm định'),

('ORD-33109', 'CUST-6604', N'Mở hộp chỉ có cục đá, không có máy bên trong', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300', N'Nghi vấn làm giả / dàn dựng (15%)', N'12.5x (Bất thường nghiêm trọng)', N'4 giờ', 96, 'critical', N'FRAUD RING CỰC CAO', 'fraud_freeze', N'Đóng băng khiếu nại & Chuyển Đội Điều Tra Gian Lận', N'Phát hiện thiết bị (Device ID) và địa chỉ IP trùng lặp với mạng lưới 5 tài khoản ảo vừa bị Shopee khóa tuần trước vì gian lận hoàn tiền sản phẩm giá trị lớn (Fraud Ring). Tạm giữ tiền và báo cáo đội phòng chống gian lận.', N'Đã khóa - Chờ điều tra'),

('ORD-11029', 'CUST-1033', N'Chai serum bị rò rỉ dung dịch ướt đẫm bọc chống sốc', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', N'Khá cao (82%)', N'1.0x (Tài khoản mới)', N'1 ngày', 48, 'medium', N'RỦI RO TRUNG BÌNH (COLD-START)', 'staff_review', N'Xác minh đối soát nhanh với Đơn Vị Vận Chuyển', N'Tài khoản mới mua đơn đầu tiên (Cold-start, chưa có lịch sử mua để tính điểm tin cậy). Tuy nhiên hình ảnh hàng bể vỡ khá rõ nét. Hệ thống tạo phiếu đối soát với bưu cục giao nhận trước khi duyệt.', N'Chờ thẩm định');
GO

-- Ghi nhận 1 lịch sử CSKH mẫu
INSERT INTO dbo.AuditLogs (RequestId, StaffName, StaffAction, StaffNote) VALUES
(3, N'Nguyễn Thị Mai (Fraud Specialist)', N'Yêu cầu kiểm tra kỹ thuật', N'Đã gửi thông báo yêu cầu người mua đem tai nghe ra bưu cục Viettel Post gần nhất để gửi về Trung tâm Thẩm định Shopee.');
GO

-- KIỂM TRA DỮ LIỆU SAU KHI TẠO
SELECT 
    r.RequestId, 
    c.FullName, 
    c.Tier, 
    o.ProductName, 
    o.PriceFormatted, 
    r.RiskScore, 
    r.RiskLevel, 
    r.AiRecommendation 
FROM dbo.RefundRequests r
JOIN dbo.Orders o ON r.OrderId = o.OrderId
JOIN dbo.Customers c ON r.CustomerId = c.CustomerId;
GO
