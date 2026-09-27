// ============================================================================
// HỆ THỐNG SHOPEE AI FRAUD SHIELD - BACKEND SERVER (NODE.JS + MSSQL)
// Kết nối Microsoft SQL Server với Giao diện Web Shopee
// ============================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
let sql = null;
try {
  sql = require('mssql');
} catch (e) {
  // mssql package will be required when user runs npm install
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ============================================================================
// 1. CẤU HÌNH KẾT NỐI MICROSOFT SQL SERVER
// Lưu ý: Thay đổi user và password tương ứng với SQL Server của bạn (mặc định là sa)
// ============================================================================
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Pasword1234Ki',
  server: process.env.DB_SERVER || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_DATABASE || 'ShopeeFraudShieldDB',
  options: {
    encrypt: false, // Set false nếu chạy localhost
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let dbPool = null;
let isDbConnected = false;

async function connectToDatabase() {
  if (!sql) {
    console.log('⚠️  Thư viện "mssql" chưa được cài đặt. Hệ thống đang dùng Mock Memory Mode.');
    return;
  }
  try {
    dbPool = await sql.connect(dbConfig);
    isDbConnected = true;
    console.log('✅ ĐÃ KẾT NỐI THÀNH CÔNG VỚI MICROSOFT SQL SERVER (ShopeeFraudShieldDB)!');
  } catch (err) {
    isDbConnected = false;
    console.log('⚠️  Chưa kết nối được SQL Server:', err.message);
    console.log('👉 Hệ thống tự động chuyển sang chế độ Dự phòng (Mock In-Memory) để web vẫn chạy bình thường.');
  }
}

connectToDatabase();

// ============================================================================
// 2. DỮ LIỆU DỰ PHÒNG (FALLBACK MOCK DATA NẾU CHƯA KẾT NỐI ĐƯỢC SQL SERVER)
// ============================================================================
const fallbackCases = {
  1: {
    id: 1,
    name: "Hoàng Nam",
    tier: "Kim Cương VIP",
    custId: "CUST-8812",
    order: { code: "ORD-98234", product: "Áo Thun Nam Cotton Shopee Choice", price: 149000, priceFormatted: "₫149,000" },
    reason: "Áo bị rách đường may ở cánh tay khi mở gói",
    evidenceImg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300",
    features: { freq30d: "0 lần", returnRate: "2.2%", orderDeviation: "1.0x (Chuẩn)", evidence: "Rất cao (94%)", claimDelay: "2 giờ" },
    riskScore: 12,
    riskLevel: "low",
    riskLabel: "RỦI RO THẤP",
    decisionType: "instant_refund",
    aiRecommendation: "Tự động phê duyệt hoàn tiền ngay (Instant Refund)",
    aiRecommendationDesc: "Khách hàng VIP có độ tin cậy cao, tỷ lệ hoàn tiền 2.2% rất thấp, đơn giá trị nhỏ. Tự động duyệt hoàn tiền về ví ShopeePay không cần hoàn trả hàng.",
    status: "Đã tự động duyệt"
  },
  2: {
    id: 2,
    name: "Nguyễn Văn B",
    tier: "Khách Hàng Vàng",
    custId: "CUST-4109",
    order: { code: "ORD-88121", product: "Giày Thể Thao Nam Sneaker Runner", price: 680000, priceFormatted: "₫680,000" },
    reason: "Giao nhầm màu và sai kích thước (đặt size 42 giao size 40)",
    evidenceImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    features: { freq30d: "1 lần", returnRate: "5.5%", orderDeviation: "1.2x (Bình thường)", evidence: "Trung bình (68%)", claimDelay: "1 ngày" },
    riskScore: 38,
    riskLevel: "medium",
    riskLabel: "RỦI RO TRUNG BÌNH",
    decisionType: "staff_review",
    aiRecommendation: "Yêu cầu cung cấp video mở hộp / CSKH duyệt",
    aiRecommendationDesc: "Có ảnh chụp hộp giày nhưng thiếu video unboxing chuẩn xác để đối soát tem mã vận đơn của bưu tá. Đề xuất hệ thống yêu cầu bổ sung video.",
    status: "Chờ thẩm định"
  },
  3: {
    id: 3,
    name: "Trần Thị C",
    tier: "Khách Hàng Bạc",
    custId: "CUST-9921",
    order: { code: "ORD-77412", product: "Tai Nghe Chống Ồn Bluetooth Pro ANC", price: 1450000, priceFormatted: "₫1,450,000" },
    reason: "Tai nghe rè 1 bên tai, không kết nối được Bluetooth",
    evidenceImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
    features: { freq30d: "4 lần (Cao)", returnRate: "33.3%", orderDeviation: "3.8x (Đơn giá trị cao)", evidence: "Thấp (30% - Không rõ lỗi)", claimDelay: "2 ngày" },
    riskScore: 74,
    riskLevel: "high",
    riskLabel: "RỦI RO CAO",
    decisionType: "staff_review",
    aiRecommendation: "Chuyển chuyên viên CSKH thẩm định & Thu hồi hàng",
    aiRecommendationDesc: "Khách có tần suất hoàn tiền cao bất thường (4 lần / 30 ngày, chiếm 33.3% lịch sử), giá trị đơn gấp 3.8 lần đơn trung bình. Cần thu hồi sản phẩm về kho Shopee kiểm tra kỹ thuật trước khi hoàn tiền.",
    status: "Chờ thẩm định"
  },
  4: {
    id: 4,
    name: "Lê Văn D (Gian Lận)",
    tier: "Khách Hàng Mới",
    custId: "CUST-6604",
    order: { code: "ORD-33109", product: "Điện Thoại Thông Minh Flagship Pro Max", price: 24990000, priceFormatted: "₫24,990,000" },
    reason: "Mở hộp chỉ có cục đá, không có máy bên trong",
    evidenceImg: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
    features: { freq30d: "5 lần (Cực cao)", returnRate: "85.0%", orderDeviation: "12.5x (Bất thường nghiêm trọng)", evidence: "Nghi vấn làm giả / dàn dựng (15%)", claimDelay: "4 giờ" },
    riskScore: 96,
    riskLevel: "critical",
    riskLabel: "FRAUD RING CỰC CAO",
    decisionType: "fraud_freeze",
    aiRecommendation: "Đóng băng khiếu nại & Chuyển Đội Điều Tra Gian Lận",
    aiRecommendationDesc: "Phát hiện thiết bị (Device ID) và địa chỉ IP trùng lặp với mạng lưới 5 tài khoản ảo vừa bị Shopee khóa tuần trước vì gian lận hoàn tiền sản phẩm giá trị lớn (Fraud Ring). Tạm giữ tiền và báo cáo đội phòng chống gian lận.",
    status: "Đã khóa - Chờ điều tra"
  },
  5: {
    id: 5,
    name: "Phạm Thu Hà",
    tier: "Khách Hàng Mới (Cold-Start)",
    custId: "CUST-1033",
    order: { code: "ORD-11029", product: "Bộ Serum Dưỡng Da Cấp Ẩm Phục Hồi", price: 420000, priceFormatted: "₫420,000" },
    reason: "Chai serum bị rò rỉ dung dịch ướt đẫm bọc chống sốc",
    evidenceImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300",
    features: { freq30d: "0 lần (Đơn đầu)", returnRate: "0.0%", orderDeviation: "1.0x (Tài khoản mới)", evidence: "Khá cao (82%)", claimDelay: "1 ngày" },
    riskScore: 48,
    riskLevel: "medium",
    riskLabel: "RỦI RO TRUNG BÌNH (COLD-START)",
    decisionType: "staff_review",
    aiRecommendation: "Xác minh đối soát nhanh với Đơn Vị Vận Chuyển",
    aiRecommendationDesc: "Tài khoản mới mua đơn đầu tiên (Cold-start, chưa có lịch sử mua để tính điểm tin cậy). Tuy nhiên hình ảnh hàng bể vỡ khá rõ nét. Hệ thống tạo phiếu đối soát với bưu cục giao nhận trước khi duyệt.",
    status: "Chờ thẩm định"
  }
};

// ============================================================================
// 3. CÁC API ENDPOINTS
// ============================================================================

// Kiểm tra trạng thái máy chủ & CSDL
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    serverTime: new Date().toISOString(),
    databaseConnected: isDbConnected,
    databaseEngine: 'Microsoft SQL Server',
    databaseName: dbConfig.database
  });
});

// Lấy danh sách toàn bộ các ca thẩm định
app.get('/api/cases', async (req, res) => {
  if (isDbConnected && dbPool) {
    try {
      const result = await dbPool.request().query(`
        SELECT 
          r.RequestId AS id,
          c.FullName AS name,
          c.Tier AS tier,
          c.CustomerId AS custId,
          o.OrderId AS orderCode,
          o.ProductName AS product,
          o.Price AS price,
          o.PriceFormatted AS priceFormatted,
          r.Reason AS reason,
          r.EvidenceImg AS evidenceImg,
          r.EvidenceConfidence AS featEvidence,
          r.OrderAnomalyRatio AS featAnomaly,
          r.ClaimDelay AS featDelay,
          c.RefundCount30Days AS featFreq,
          c.RefundRate AS featRate,
          r.RiskScore AS riskScore,
          r.RiskLevel AS riskLevel,
          r.RiskLabel AS riskLabel,
          r.DecisionType AS decisionType,
          r.AiRecommendation AS aiRecommendation,
          r.AiRecommendationDesc AS aiRecommendationDesc,
          r.Status AS status
        FROM dbo.RefundRequests r
        JOIN dbo.Orders o ON r.OrderId = o.OrderId
        JOIN dbo.Customers c ON r.CustomerId = c.CustomerId
        ORDER BY r.RequestId ASC
      `);

      const casesObj = {};
      result.recordset.forEach(row => {
        casesObj[row.id] = {
          id: row.id,
          name: row.name,
          tier: row.tier,
          custId: row.custId,
          order: {
            code: row.orderCode,
            product: row.product,
            price: row.price,
            priceFormatted: row.priceFormatted
          },
          reason: row.reason,
          evidenceImg: row.evidenceImg,
          features: {
            freq30d: `${row.featFreq} lần`,
            returnRate: `${row.featRate}%`,
            orderDeviation: row.featAnomaly,
            evidence: row.featEvidence,
            claimDelay: row.featDelay
          },
          riskScore: row.riskScore,
          riskLevel: row.riskLevel,
          riskLabel: row.riskLabel,
          decisionType: row.decisionType,
          aiRecommendation: row.aiRecommendation,
          aiRecommendationDesc: row.aiRecommendationDesc,
          status: row.status
        };
      });

      return res.json({ success: true, source: 'MSSQL_DATABASE', data: casesObj });
    } catch (err) {
      console.error('Lỗi khi truy vấn SQL Server:', err);
      return res.json({ success: true, source: 'FALLBACK_MOCK', data: fallbackCases, error: err.message });
    }
  }

  // Fallback nếu chưa cắm SQL Server
  return res.json({ success: true, source: 'FALLBACK_MOCK', data: fallbackCases });
});

// Ghi nhận quyết định thẩm định của nhân viên CSKH (Human-in-the-Loop)
app.post('/api/audit', async (req, res) => {
  const { requestId, staffName, action, note } = req.body;
  if (!requestId || !action) {
    return res.status(400).json({ success: false, message: 'Thiếu requestId hoặc action' });
  }

  if (isDbConnected && dbPool) {
    try {
      // 1. Chèn vào bảng AuditLogs (kèm thông tin chi tiết đơn hàng, khách hàng, sản phẩm)
      await dbPool.request()
        .input('reqId', sql.Int, requestId)
        .input('staff', sql.NVarChar, staffName || 'Chuyên viên CSKH Shopee')
        .input('act', sql.NVarChar, action)
        .input('nt', sql.NVarChar, note || '')
        .query(`
          INSERT INTO dbo.AuditLogs (RequestId, OrderId, CustomerName, ProductName, RefundAmount, StaffName, StaffAction, StaffNote)
          SELECT 
            @reqId,
            o.OrderId,
            c.FullName,
            o.ProductName,
            o.PriceFormatted,
            @staff,
            @act,
            @nt
          FROM dbo.RefundRequests r
          JOIN dbo.Orders o ON r.OrderId = o.OrderId
          JOIN dbo.Customers c ON r.CustomerId = c.CustomerId
          WHERE r.RequestId = @reqId;
        `);

      // 2. Cập nhật trạng thái trong bảng RefundRequests
      let newStatus = 'Đã thẩm định';
      if (action.includes('Duyệt')) newStatus = 'Đã phê duyệt';
      else if (action.includes('Bổ sung')) newStatus = 'Yêu cầu bổ sung';
      else if (action.includes('Trả Hàng')) newStatus = 'Chờ thu hồi hàng';
      else if (action.includes('Khóa') || action.includes('Fraud')) newStatus = 'Đã khóa gian lận';

      await dbPool.request()
        .input('reqId', sql.Int, requestId)
        .input('st', sql.NVarChar, newStatus)
        .query(`
          UPDATE dbo.RefundRequests SET Status = @st WHERE RequestId = @reqId;
        `);

      return res.json({ success: true, message: 'Đã lưu quyết định vào SQL Server thành công!', newStatus });
    } catch (err) {
      console.error('Lỗi khi ghi vào SQL Server:', err);
      return res.status(500).json({ success: false, message: 'Lỗi ghi CSDL', error: err.message });
    }
  }

  // Fallback
  if (fallbackCases[requestId]) {
    fallbackCases[requestId].status = action;
  }
  return res.json({ success: true, message: 'Đã ghi nhận quyết định (Mock Mode)!', action });
});

// Chạy server
app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 SHOPEE AI FRAUD SHIELD SERVER ĐANG CHẠY TẠI:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`========================================================`);
});
