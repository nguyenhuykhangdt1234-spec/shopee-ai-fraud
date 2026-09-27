// Shopee AI Fraud & Refund Management System
// Implements the To-Be Business Process & Multi-tier AI Decision Engine

document.addEventListener('DOMContentLoaded', () => {
  // ==================== DATA DEFINITIONS (5 TEST CASES) ====================
  const testCasesData = {
    1: {
      id: 1,
      name: "Nguyễn Thảo My",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      tier: "",
      custId: "CUST-98241",
      totalOrders: 45,
      refundedOrders: 1,
      freq30d: 0,
      refundRate: 2.2,
      order: {
        code: "SPX-VN-9428174",
        product: "Áo Polo Nam Thể Thao Coolmax Thoáng Khí Co Giãn 4 Chiều",
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=180&q=80",
        price: 149000,
        priceFormatted: "₫149.000",
        shop: "Coolmate Official Store",
        deliveredTime: "2 giờ trước"
      },
      reason: "Giao sai màu sắc (Đặt màu Đen nhưng nhận màu Trắng)",
      evidenceImg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=180&q=80",
      riskScore: 12,
      riskLevel: "low",
      riskLabel: "RỦI RO THẤP (< 25%)",
      aiRecommendation: "Tự động phê duyệt hoàn tiền ngay lập tức",
      aiRecommendationDesc: "Khách hàng thân thiết, lịch sử giao dịch uy tín cao. Giá trị đơn nhỏ. Tự động hoàn tiền về ví ShopeePay mà không cần yêu cầu trả lại hàng.",
      features: {
        freq: "0 lần",
        freqClass: "text-success",
        rate: "2.2%",
        rateClass: "text-success",
        anomaly: "1.0x (Chuẩn)",
        anomalyClass: "text-success",
        evidence: "Rất cao (94%)",
        evidenceClass: "text-success",
        time: "2 giờ"
      },
      decisionType: "auto_approve"
    },
    2: {
      id: 2,
      name: "Lê Minh Khang",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      tier: "",
      custId: "CUST-41029",
      totalOrders: 12,
      refundedOrders: 2,
      freq30d: 1,
      refundRate: 16.6,
      order: {
        code: "SPX-VN-8273619",
        product: "Tai Nghe Bluetooth True Wireless TWS Chống Ồn ENC",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=180&q=80",
        price: 420000,
        priceFormatted: "₫420.000",
        shop: "Baseus Flagship Store",
        deliveredTime: "1 ngày trước"
      },
      reason: "Tai nghe bên trái không lên nguồn, không sạc được",
      evidenceImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=180&q=80",
      riskScore: 48,
      riskLevel: "medium",
      riskLabel: "RỦI RO TRUNG BÌNH (25 - 59%)",
      aiRecommendation: "Yêu cầu bổ sung video unboxing/kiểm tra",
      aiRecommendationDesc: "Ảnh đính kèm chỉ chụp bên ngoài tai nghe, không thể hiện được lỗi mất nguồn. Cần gửi form yêu cầu khách hàng bổ sung video quay cảnh cắm sạc trong vòng 24h.",
      features: {
        freq: "1 lần",
        freqClass: "text-warning",
        rate: "16.6%",
        rateClass: "text-warning",
        anomaly: "1.4x (Hơi cao)",
        anomalyClass: "text-warning",
        evidence: "Trung bình (52% - thiếu clip)",
        evidenceClass: "text-warning",
        time: "24 giờ"
      },
      decisionType: "need_evidence"
    },
    3: {
      id: 3,
      name: "Trần Hoàng Nam",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      tier: "",
      custId: "CUST-19284",
      totalOrders: 11,
      refundedOrders: 6,
      freq30d: 4,
      refundRate: 54.5,
      order: {
        code: "SPX-VN-1192840",
        product: "Nồi Chiên Không Dầu Điện Tử Philips XXL 6.2 Lít HD9280",
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=180&q=80",
        price: 2650000,
        priceFormatted: "₫2.650.000",
        shop: "Điện Máy Gia Dụng Store",
        deliveredTime: "5 giờ trước"
      },
      reason: "Hàng bị móp méo vỏ nhựa, trầy xước nặng và không hoạt động",
      evidenceImg: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=180&q=80",
      riskScore: 74,
      riskLevel: "high",
      riskLabel: "RỦI RO CAO (60 - 84%)",
      aiRecommendation: "Chuyển Nhân viên CSKH Thẩm định",
      aiRecommendationDesc: "Tài khoản có tỷ lệ hoàn tiền vượt ngưỡng 50% trong 30 ngày qua (4 lần hoàn). Giá trị đơn hàng gấp 12 lần giá trị trung bình lịch sử. Ảnh có dấu hiệu mờ, nghi vấn sử dụng ảnh mạng.",
      features: {
        freq: "4 lần (Vượt ngưỡng)",
        freqClass: "text-danger",
        rate: "54.5% (Bất thường)",
        rateClass: "text-danger",
        anomaly: "12.0x (Đột biến lớn)",
        anomalyClass: "text-danger",
        evidence: "Thấp (35% - Nghi ảnh mạng)",
        evidenceClass: "text-danger",
        time: "5 giờ"
      },
      decisionType: "agent_review"
    },
    4: {
      id: 4,
      name: "Vũ Quốc Bảo (Nghi vấn Fraud Ring)",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
      tier: "",
      custId: "CUST-77491",
      totalOrders: 3,
      refundedOrders: 3,
      freq30d: 3,
      refundRate: 100.0,
      order: {
        code: "SPX-VN-9920184",
        product: "Máy Tính Bảng iPad Pro M2 11-inch Wi-Fi 128GB Chính Hãng",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=180&q=80",
        price: 18490000,
        priceFormatted: "₫18.490.000",
        shop: "Apple Flagship Store",
        deliveredTime: "30 phút trước"
      },
      reason: "Mở kiện hàng ra chỉ thấy hộp giấy rỗng và gạch vụn bên trong",
      evidenceImg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=180&q=80",
      riskScore: 95,
      riskLevel: "critical",
      riskLabel: "FRAUD RING (>= 85%)",
      aiRecommendation: "Tạm Khóa & Chuyển Tổ Điều Tra Chuyên Sâu",
      aiRecommendationDesc: "Phát hiện liên kết Graph-Fraud: Trùng Device ID và IP subnet với 4 tài khoản khác đã bị cấm vì gian lận hoàn đơn rỗng (Empty box scam). Đơn vị giá trị cao (₫18.49M). Đóng băng tài khoản ngay.",
      features: {
        freq: "3 lần / 3 ngày",
        freqClass: "text-danger",
        rate: "100% (Cực đoan)",
        rateClass: "text-danger",
        anomaly: "25.0x (Cực đại)",
        anomalyClass: "text-danger",
        evidence: "Đơn rỗng (Nghi gian lận)",
        evidenceClass: "text-danger",
        time: "30 phút (Hối thúc)"
      },
      decisionType: "fraud_freeze"
    },
    5: {
      id: 5,
      name: "Đỗ Hải Đăng (Khách mới - Cold Start)",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
      tier: "",
      custId: "CUST-00412",
      totalOrders: 1,
      refundedOrders: 0,
      freq30d: 0,
      refundRate: 0.0,
      order: {
        code: "SPX-VN-5509124",
        product: "Đồng Hồ Thông Minh Apple Watch SE 2023 GPS 40mm",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=180&q=80",
        price: 4890000,
        priceFormatted: "₫4.890.000",
        shop: "Thế Giới Công Nghệ Shopee",
        deliveredTime: "15 phút trước"
      },
      reason: "Đeo thử không vừa tay, muốn đổi sang mẫu 44mm và hoàn tiền",
      evidenceImg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=180&q=80",
      riskScore: 68,
      riskLevel: "high",
      riskLabel: "RỦI RO CAO (Cold-Start)",
      aiRecommendation: "Chuyển Nhân viên CSKH kiểm tra chứng từ",
      aiRecommendationDesc: "Theo Mục 7.2 (Đạo đức & Định kiến AI): Khách hàng mới chưa có dữ liệu lịch sử nhưng mua sản phẩm công nghệ đắt tiền (₫4.89M) và yêu cầu hoàn sau 15 phút. Chuyển người thật thẩm định để tránh tráo hàng.",
      features: {
        freq: "0 lần (Chưa có LS)",
        freqClass: "text-warning",
        rate: "N/A (Tài khoản mới)",
        rateClass: "text-warning",
        anomaly: "Chưa có chuẩn so sánh",
        anomalyClass: "text-warning",
        evidence: "Đầy đủ seal",
        evidenceClass: "text-success",
        time: "15 phút"
      },
      decisionType: "agent_review"
    }
  };

  // State
  let currentCaseId = 1;
  let currentCase = testCasesData[currentCaseId];
  let chatStep = "initial"; // 'initial' | 'picked_order' | 'picked_reason' | 'uploaded_evidence' | 'completed'

  // DOM Elements
  const tabButtons = document.querySelectorAll('.nav-btn');
  const viewSections = document.querySelectorAll('.view-section');
  const testcaseToggleBtn = document.getElementById('testcase-toggle-btn');
  const testcaseMenu = document.getElementById('testcase-menu');
  const testcaseItems = document.querySelectorAll('.testcase-item');
  const chatMessagesEl = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const quickChips = document.getElementById('quick-chips');
  const resetChatBtn = document.getElementById('reset-chat-btn');
  const aiProcessBar = document.getElementById('ai-process-bar');

  // Sidebar Elements
  const userAvatarEl = document.getElementById('user-avatar');
  const userNameEl = document.getElementById('user-name');
  const userTierEl = document.getElementById('user-tier');
  const userIdEl = document.getElementById('user-id');
  const sidebarOrdersList = document.getElementById('sidebar-orders-list');
  const statTotalOrders = document.getElementById('stat-total-orders');
  const statRefundedOrders = document.getElementById('stat-refunded-orders');
  const statFreq30d = document.getElementById('stat-freq-30d');
  const statRefundRate = document.getElementById('stat-refund-rate');

  // Inspector Elements
  const riskScoreValue = document.getElementById('risk-score-value');
  const meterFill = document.getElementById('meter-fill');
  const riskTierBadge = document.getElementById('risk-tier-badge');
  const featFreq = document.getElementById('feat-freq');
  const featRate = document.getElementById('feat-rate');
  const featAnomaly = document.getElementById('feat-anomaly');
  const featEvidence = document.getElementById('feat-evidence');
  const featTime = document.getElementById('feat-time');
  const aiDecisionText = document.getElementById('ai-decision-text');

  // Dashboard Elements
  const queueTableBody = document.getElementById('queue-table-body');
  const caseDetailContent = document.getElementById('case-detail-content');
  const selectedCaseBadge = document.getElementById('selected-case-badge');

  // ==================== NAVIGATION TABS ====================
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      viewSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const targetScreen = document.getElementById(btn.dataset.target);
      if (targetScreen) targetScreen.classList.add('active');
    });
  });

  // Toggle Testcases Dropdown
  testcaseToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    testcaseMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    testcaseMenu.classList.remove('show');
  });

  testcaseItems.forEach(item => {
    item.addEventListener('click', () => {
      const caseId = parseInt(item.dataset.case);
      loadTestCase(caseId);
      testcaseMenu.classList.remove('show');
      
      // Auto switch to customer chat tab
      document.getElementById('tab-chat-btn').click();
    });
  });

  // ==================== LOAD TEST CASE FUNCTION ====================
  function loadTestCase(caseId) {
    currentCaseId = caseId;
    currentCase = testCasesData[caseId];

    // 1. Update User Profile Sidebar
    userAvatarEl.src = currentCase.avatar;
    userNameEl.innerText = currentCase.name;
    if (userTierEl) userTierEl.style.display = 'none';
    userIdEl.innerText = `Mã KH: #${currentCase.custId}`;

    statTotalOrders.innerText = `${currentCase.totalOrders} đơn`;
    statRefundedOrders.innerText = `${currentCase.refundedOrders} đơn`;
    statFreq30d.innerText = currentCase.features.freq;
    statRefundRate.innerText = currentCase.features.rate;
    statRefundRate.className = `stat-val ${currentCase.features.rateClass}`;

    // 2. Render Sidebar Orders
    renderSidebarOrders();

    // 3. Update Real-time Inspector (XAI)
    updateXAIInspector(currentCase);

    // 4. Reset & Start Interactive Chatbot Conversation
    initChatConversation();

    // 5. Refresh Dashboard Queue & Selection
    renderDashboardQueue();
    renderDashboardCaseDetail(currentCase);
  }

  function renderSidebarOrders() {
    sidebarOrdersList.innerHTML = `
      <div class="order-mini-card selected" id="side-order-${currentCase.order.code}">
        <img class="order-thumb" src="${currentCase.order.image}" alt="Product">
        <div class="order-brief">
          <div class="order-name">${currentCase.order.product}</div>
          <div class="order-price">${currentCase.order.priceFormatted}</div>
          <div class="order-meta-info">
            <span>${currentCase.order.deliveredTime}</span>
            <span class="text-success">✓ Đã giao</span>
          </div>
        </div>
      </div>
    `;
  }

  function updateXAIInspector(c) {
    riskScoreValue.innerText = `${c.riskScore}%`;
    riskScoreValue.className = `risk-val val-${c.riskLevel}`;

    meterFill.style.width = `${c.riskScore}%`;
    meterFill.className = `meter-fill fill-${c.riskLevel}`;

    riskTierBadge.innerText = c.riskLabel;
    riskTierBadge.className = `tier-pill pill-${c.riskLevel}`;

    featFreq.innerText = c.features.freq;
    featFreq.className = `feat-value ${c.features.freqClass}`;

    featRate.innerText = c.features.rate;
    featRate.className = `feat-value ${c.features.rateClass}`;

    featAnomaly.innerText = c.features.anomaly;
    featAnomaly.className = `feat-value ${c.features.anomalyClass}`;

    featEvidence.innerText = c.features.evidence;
    featEvidence.className = `feat-value ${c.features.evidenceClass}`;

    featTime.innerText = c.features.time;

    aiDecisionText.innerHTML = `
      <strong>${c.aiRecommendation}</strong>
      <p>${c.aiRecommendationDesc}</p>
    `;
  }

  // ==================== INTERACTIVE CHATBOT LOGIC ====================
  function initChatConversation() {
    chatMessagesEl.innerHTML = '';
    aiProcessBar.classList.add('hidden');
    chatStep = 'initial';

    // Welcome Message from Shopee Assistant
    addBotMessage(`
      Xin chào <strong>${currentCase.name}</strong>! Tôi là Trợ lý AI Hoàn tiền & Trả hàng của Shopee. 👋<br><br>
      Tôi có thể hỗ trợ bạn xử lý yêu cầu hoàn tiền tự động 24/7 chỉ trong vài phút. Bạn muốn bắt đầu với đơn hàng nào dưới đây?
    `);

    // Render Order Selection Card in Chat
    setTimeout(() => {
      addBotOrderPickerCard(currentCase.order);
    }, 400);
  }

  function addBotMessage(htmlContent) {
    const timeStr = getCurrentTime();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot';
    msgDiv.innerHTML = `
      <img class="msg-avatar" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80" alt="Shopee Bot">
      <div class="msg-bubble">
        <div class="msg-text">${htmlContent}</div>
        <span class="msg-time">${timeStr}</span>
      </div>
    `;
    chatMessagesEl.appendChild(msgDiv);
    scrollChatToBottom();
  }

  function addUserMessage(text) {
    const timeStr = getCurrentTime();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';
    msgDiv.innerHTML = `
      <img class="msg-avatar" src="${currentCase.avatar}" alt="User">
      <div class="msg-bubble">
        <div class="msg-text">${text}</div>
        <span class="msg-time">${timeStr}</span>
      </div>
    `;
    chatMessagesEl.appendChild(msgDiv);
    scrollChatToBottom();
  }

  function addBotOrderPickerCard(order) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'message bot';
    cardDiv.innerHTML = `
      <img class="msg-avatar" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80" alt="Shopee Bot">
      <div class="msg-bubble" style="width: 100%;">
        <strong>Chọn đơn hàng cần khiếu nại hoàn tiền:</strong>
        <div class="chat-order-card">
          <img src="${order.image}" class="chat-order-img" alt="Product">
          <div class="chat-order-details">
            <h5>${order.product}</h5>
            <div class="price">${order.priceFormatted}</div>
            <small style="color: #64748b;">Mã đơn: ${order.code} • Đã giao ${order.deliveredTime}</small>
          </div>
        </div>
        <button id="btn-select-order" class="btn-text" style="width: 100%; background: var(--shopee-orange); color: #fff; border: none; padding: 8px; border-radius: 6px; font-weight: 700;">
          👉 Chọn đơn này để Hoàn tiền
        </button>
      </div>
    `;
    chatMessagesEl.appendChild(cardDiv);
    scrollChatToBottom();

    // Attach click
    cardDiv.querySelector('#btn-select-order').addEventListener('click', () => {
      addUserMessage(`Tôi muốn yêu cầu trả hàng / hoàn tiền cho đơn: ${order.product}`);
      showReasonPicker();
    });
  }

  function showReasonPicker() {
    chatStep = 'picked_order';
    setTimeout(() => {
      addBotMessage(`
        Cảm ơn bạn. Vui lòng cho Shopee biết <strong>Lý do chính xác</strong> bạn muốn trả hàng hoặc hoàn tiền:
        <div class="reason-options-grid">
          <button class="reason-btn" data-reason="${currentCase.reason}">
            ⚠️ ${currentCase.reason} (Khớp với kịch bản test)
          </button>
          <button class="reason-btn" data-reason="Hàng bị bể vỡ, hư hỏng trong quá trình vận chuyển">
            📦 Hàng bị bể vỡ, hư hỏng trong quá trình vận chuyển
          </button>
          <button class="reason-btn" data-reason="Hàng lỗi kỹ thuật, không thể sử dụng bình thường">
            🔌 Hàng lỗi kỹ thuật, không thể sử dụng bình thường
          </button>
          <button class="reason-btn" data-reason="Nhận hàng thiếu phụ kiện, sai số lượng">
            🔢 Nhận hàng thiếu phụ kiện, sai số lượng
          </button>
        </div>
      `);

      document.querySelectorAll('.reason-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const reasonText = btn.dataset.reason;
          addUserMessage(`Lý do: ${reasonText}`);
          showEvidenceStep();
        });
      });
    }, 400);
  }

  function showEvidenceStep() {
    chatStep = 'picked_reason';
    setTimeout(() => {
      addBotMessage(`
        Để bảo vệ quyền lợi của bạn và Shopee có căn cứ phân tích, bạn vui lòng đính kèm <strong>ảnh chụp sản phẩm lỗi</strong> hoặc <strong>video mở hộp (unboxing)</strong>:
        <div class="evidence-upload-zone" id="upload-trigger">
          <div style="font-size: 28px;">📷</div>
          <strong>Nhấn vào đây để tải ảnh / video bằng chứng</strong>
          <p>Hỗ trợ JPG, PNG, MP4 (Tối đa 30MB)</p>
          <div class="evidence-preview-wrap">
            <img src="${currentCase.evidenceImg}" class="evidence-thumb" alt="Bằng chứng mẫu">
            <span style="font-size: 11px; color: var(--shopee-orange); align-self: center;">Đã đính kèm ảnh bằng chứng mẫu từ hệ thống</span>
          </div>
        </div>
        <button id="btn-submit-refund" class="btn-text" style="width: 100%; background: var(--shopee-orange); color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: 700; margin-top: 8px;">
          🚀 Gửi Yêu Cầu & Bắt Đầu Phân Tích AI
        </button>
      `);

      document.getElementById('btn-submit-refund').addEventListener('click', () => {
        addUserMessage("Tôi đã đính kèm đầy đủ ảnh bằng chứng, nhờ Shopee kiểm tra và hoàn tiền giúp tôi.");
        triggerAIPipeline();
      });
    }, 500);
  }

  // ==================== VISUAL AI PIPELINE STEPPER (TO-BE FLOW) ====================
  function triggerAIPipeline() {
    chatStep = 'analyzing';
    aiProcessBar.classList.remove('hidden');

    const s1 = document.getElementById('p-step-1');
    const s2 = document.getElementById('p-step-2');
    const s3 = document.getElementById('p-step-3');
    const s4 = document.getElementById('p-step-4');

    const l1 = document.getElementById('p-line-1');
    const l2 = document.getElementById('p-line-2');
    const l3 = document.getElementById('p-line-3');

    // Reset steps
    [s1, s2, s3, s4].forEach(s => s.classList.remove('active'));
    [l1, l2, l3].forEach(l => l.classList.remove('active'));

    // Step 1: Ingest Data
    s1.classList.add('active');
    addBotMessage("🔄 <em>Hệ thống đang tiếp nhận đơn hàng, đồng bộ hóa lịch sử tài khoản và kiểm tra chứng từ...</em>");

    setTimeout(() => {
      // Step 2: Feature Engineering
      l1.classList.add('active');
      s2.classList.add('active');
      
      setTimeout(() => {
        // Step 3: Risk Engine Scoring
        l2.classList.add('active');
        s3.classList.add('active');

        setTimeout(() => {
          // Step 4: Decision Tree & Outcome
          l3.classList.add('active');
          s4.classList.add('active');

          setTimeout(() => {
            renderFinalDecisionMessage();
          }, 400);
        }, 600);
      }, 600);
    }, 600);
  }

  function renderFinalDecisionMessage() {
    chatStep = 'completed';
    const c = currentCase;

    let bannerHTML = '';
    if (c.decisionType === 'auto_approve') {
      bannerHTML = `
        <div class="decision-banner banner-auto-approved">
          <div class="banner-icon">✅</div>
          <div class="banner-content">
            <h5>YÊU CẦU HOÀN TIỀN ĐƯỢC PHÊ DUYỆT TỰ ĐỘNG</h5>
            <p>
              Mô hình AI xác thực: Điểm rủi ro <strong>${c.riskScore}% (Rất thấp)</strong>.<br>
              Số tiền <strong>${c.order.priceFormatted}</strong> đã được hoàn về <strong>Ví ShopeePay</strong> của bạn.<br>
              <em>✨ Bạn không cần gửi trả lại sản phẩm. Chúc bạn có trải nghiệm mua sắm tuyệt vời cùng Shopee!</em>
            </p>
          </div>
        </div>
      `;
    } else if (c.decisionType === 'need_evidence') {
      bannerHTML = `
        <div class="decision-banner banner-need-evidence">
          <div class="banner-icon">⚠️</div>
          <div class="banner-content">
            <h5>YÊU CẦU BỔ SUNG THÊM BẰNG CHỨNG</h5>
            <p>
              Mô hình AI phân tích: Điểm rủi ro <strong>${c.riskScore}% (Trung bình)</strong> do hình ảnh hiện tại chưa thể hiện rõ lỗi kỹ thuật.<br>
              Vui lòng quay <strong>video unboxing hoặc clip cắm sạc sản phẩm</strong> và gửi lại trong vòng <strong>24 giờ</strong> để Shopee tiếp tục bảo vệ quyền lợi của bạn.
            </p>
          </div>
        </div>
      `;
    } else if (c.decisionType === 'agent_review') {
      bannerHTML = `
        <div class="decision-banner banner-agent-review">
          <div class="banner-icon">🛡️</div>
          <div class="banner-content">
            <h5>ĐANG CHUYỂN CHUYÊN VIÊN CSKH THẨM ĐỊNH (SLA 24H)</h5>
            <p>
              Điểm rủi ro AI: <strong>${c.riskScore}% (Cấp độ Cao)</strong>.<br>
              Yêu cầu hoàn tiền trị giá <strong>${c.order.priceFormatted}</strong> của bạn đã được chuyển tới Bộ phận Thẩm định Shopee.<br>
              <strong>Mã hồ sơ: #SHP-REF-${Math.floor(100000 + Math.random() * 900000)}</strong>. Chuyên viên sẽ phản hồi qua mục Thông báo trong vòng 24 giờ.
            </p>
          </div>
        </div>
      `;
    } else if (c.decisionType === 'fraud_freeze') {
      bannerHTML = `
        <div class="decision-banner banner-fraud-flagged">
          <div class="banner-icon">🚨</div>
          <div class="banner-content">
            <h5>YÊU CẦU ĐANG ĐƯỢC TỔ ĐIỀU TRA CHUYÊN SÂU XỬ LÝ</h5>
            <p>
              Hệ thống phát hiện dấu hiệu bất thường nghiêm trọng (Điểm rủi ro: <strong>${c.riskScore}%</strong>).<br>
              Đơn hàng trị giá <strong>${c.order.priceFormatted}</strong> đang được tạm giữ để đối soát với Đơn vị vận chuyển và Bộ phận Chống gian lận Shopee (Fraud Specialist).
            </p>
          </div>
        </div>
      `;
    }

    addBotMessage(`
      Kết quả đánh giá từ <strong>Hệ Thống Trí Tuệ Nhân Tạo Shopee</strong> cho đơn hàng <em>${c.order.code}</em>:
      ${bannerHTML}
      <div style="margin-top: 10px; font-size: 11.5px; color: #64748b;">
        Mọi quyết định đều được giải thích minh bạch qua mô hình XAI (xem chi tiết ở bảng bên phải). Cảm ơn bạn đã tin tưởng Shopee!
      </div>
    `);
  }

  // Quick Chips Actions
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.action;
      if (act === 'start_refund') {
        addUserMessage("Tôi muốn bắt đầu yêu cầu trả hàng / hoàn tiền.");
        initChatConversation();
      } else if (act === 'check_status') {
        addUserMessage("Kiểm tra tiến độ yêu cầu hoàn tiền gần nhất của tôi.");
        setTimeout(() => {
          addBotMessage(`
            Đơn hàng <strong>${currentCase.order.code}</strong> (${currentCase.order.product}):<br>
            Trạng thái hiện tại: <strong>${currentCase.aiRecommendation}</strong>.<br>
            Thời gian cập nhật: Vừa xong.
          `);
        }, 400);
      } else if (act === 'policy_faq') {
        addUserMessage("Chính sách trả hàng & hoàn tiền của Shopee như thế nào?");
        setTimeout(() => {
          addBotMessage(`
            <strong>Chính Sách Hoàn Tiền Shopee (To-Be AI Policy):</strong><br>
            1. <strong>Đơn Low Risk (<25%):</strong> Khách uy tín được hoàn tiền ngay lập tức không cần chờ shop gửi hàng.<br>
            2. <strong>Đơn Medium/High Risk:</strong> Được xử lý qua nhân viên kiểm tra bảo vệ cả quyền lợi của người mua lẫn người bán.<br>
            3. <strong>Cam kết:</strong> Miễn phí vận chuyển trả hàng 100% qua bưu cục Viettel Post / SPX Express.
          `);
        }, 400);
      }
    });
  });

  // Chat Form Input Submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    addUserMessage(text);
    chatInput.value = '';

    setTimeout(() => {
      addBotMessage(`Tôi đã nhận được tin nhắn: <em>"${text}"</em>. Hệ thống khuyến khích bạn chọn các thao tác trên thẻ tương tác để quy trình hoàn tiền được tự động hóa chuẩn xác nhất.`);
    }, 500);
  });

  resetChatBtn.addEventListener('click', () => {
    initChatConversation();
  });

  // ==================== TOAST NOTIFICATION SYSTEM ====================
  function showToast(title, message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
      success: '✅',
      warning: '⚠️',
      danger: '🚨',
      info: '🛒'
    };

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || '🔔'}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-text">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  // ==================== DASHBOARD TABLE & ACTIONS ====================
  let currentDashboardFilter = 'all';
  let currentSearchQuery = '';

  const searchInput = document.getElementById('queue-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');

  function renderDashboardQueue(filter = currentDashboardFilter) {
    currentDashboardFilter = filter;
    queueTableBody.innerHTML = '';

    const allCases = Object.values(testCasesData);
    const query = currentSearchQuery.trim().toLowerCase();

    const filteredCases = allCases.filter(item => {
      const matchFilter = (currentDashboardFilter === 'all' || item.riskLevel === currentDashboardFilter);
      if (!query) return matchFilter;
      const matchSearch = item.name.toLowerCase().includes(query) ||
                          item.order.code.toLowerCase().includes(query) ||
                          item.order.product.toLowerCase().includes(query) ||
                          item.custId.toLowerCase().includes(query) ||
                          item.riskLabel.toLowerCase().includes(query);
      return matchFilter && matchSearch;
    });

    // Cập nhật dòng chữ hiển thị trạng thái lọc & tìm kiếm
    const filterStatusEl = document.getElementById('filter-status-indicator');
    if (filterStatusEl) {
      if (query) {
        filterStatusEl.innerText = `Tìm kiếm "${query}": Tìm thấy ${filteredCases.length} / ${allCases.length} đơn`;
      } else {
        const labels = {
          'all': 'Đang hiển thị: Tất cả 5 đơn',
          'low': 'Đang lọc: Rủi ro Thấp (1 đơn)',
          'medium': 'Đang lọc: Rủi ro Trung bình (1 đơn)',
          'high': 'Đang lọc: Rủi ro Cao (2 đơn)',
          'critical': 'Đang lọc: Fraud Ring (1 đơn)'
        };
        filterStatusEl.innerText = labels[currentDashboardFilter] || `Đang hiển thị: ${filteredCases.length} đơn`;
      }
    }

    if (filteredCases.length === 0) {
      queueTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 32px 16px; color: var(--text-muted); font-size: 13px;">
            🔍 Không tìm thấy đơn hàng nào phù hợp với điều kiện lọc & tìm kiếm.
          </td>
        </tr>
      `;
      return;
    }

    filteredCases.forEach(item => {
      const tr = document.createElement('tr');
      tr.className = `queue-row ${item.id === currentCaseId ? 'selected' : ''}`;
      tr.innerHTML = `
        <td class="cell-cust">
          <strong>${item.name}</strong>
          <small>Mã KH: #${item.custId}</small>
        </td>
        <td>
          <div style="font-weight: 600; font-size: 12px; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${item.order.product}
          </div>
          <small style="color: #64748b;">Mã: ${item.order.code}</small>
        </td>
        <td style="font-weight: 700; color: var(--shopee-orange); font-family: var(--font-mono);">
          ${item.order.priceFormatted}
        </td>
        <td>
          <span class="tier-pill pill-${item.riskLevel}">${item.riskScore}% - ${item.riskLevel.toUpperCase()}</span>
        </td>
        <td style="font-size: 12px; color: var(--text-secondary);">
          ${item.aiRecommendation}
        </td>
        <td>
          <button class="btn-inspect" data-id="${item.id}">Thẩm Định</button>
        </td>
      `;

      // Click vào nút Thẩm Định hoặc cả dòng
      const handleSelectRow = () => {
        currentCaseId = item.id;
        currentCase = testCasesData[item.id];
        renderDashboardQueue(currentDashboardFilter);
        renderDashboardCaseDetail(currentCase);
        updateXAIInspector(currentCase);
      };

      tr.addEventListener('click', handleSelectRow);
      tr.querySelector('.btn-inspect').addEventListener('click', (e) => {
        e.stopPropagation();
        handleSelectRow();
      });

      queueTableBody.appendChild(tr);
    });
  }

  function renderDashboardCaseDetail(c) {
    selectedCaseBadge.className = `tier-pill pill-${c.riskLevel}`;
    selectedCaseBadge.innerText = `${c.riskLabel} (${c.riskScore}%)`;

    caseDetailContent.innerHTML = `
      <div class="audit-section">
        <h4>1. Thông Tin Đơn Hàng & Khách Hàng</h4>
        <div style="font-size: 12px; line-height: 1.6;">
          <strong>Khách hàng:</strong> ${c.name} (Mã KH: #${c.custId})<br>
          <strong>Sản phẩm:</strong> ${c.order.product}<br>
          <strong>Giá trị đơn:</strong> <span style="color: var(--shopee-orange); font-weight: 700;">${c.order.priceFormatted}</span><br>
          <strong>Lý do khiếu nại:</strong> <em>"${c.reason}"</em>
        </div>
      </div>

      <div class="audit-section">
        <h4>2. Bằng Chứng Đính Kèm</h4>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${c.evidenceImg}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #cbd5e1;" alt="Evidence">
          <div style="font-size: 12px; color: #475569;">
            <strong>Computer Vision Confidence:</strong> ${c.features.evidence}<br>
            <span style="font-size: 11px; color: #64748b;">Khớp với mô tả khiếu nại của khách hàng</span>
          </div>
        </div>
      </div>

      <div class="audit-section">
        <h4>3. Đề Xuất Của AI & Giải Thích Đặc Trưng (XAI)</h4>
        <div style="background: #fff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 12px;">
          <strong style="color: #1e3a8a;">Đề xuất: ${c.aiRecommendation}</strong>
          <p style="margin-top: 4px; color: #334155;">${c.aiRecommendationDesc}</p>
        </div>
      </div>

      <div class="audit-section">
        <h4>4. Thao Tác Của Nhân Viên CSKH</h4>
        <p style="font-size: 11.5px; color: #64748b; margin-bottom: 8px;">
          Nhân viên có quyền xem xét, chấp thuận hoặc điều chỉnh hướng xử lý theo đúng thẩm quyền. Mọi quyết định sẽ được lưu vào hệ thống Continuous Learning.
        </p>

        <textarea id="staff-note" placeholder="Nhập ghi chú thẩm định hoặc lý do điều chỉnh..." style="width: 100%; height: 60px; padding: 8px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 12px; font-family: inherit; margin-bottom: 8px;"></textarea>

        <div class="staff-actions-grid">
          <button class="btn-action-approve" id="act-approve">✅ Duyệt Hoàn Tiền</button>
          <button class="btn-action-more-info" id="act-more-info">⚠️ Yêu Cầu Bổ Sung</button>
          <button class="btn-action-reject" id="act-reject">📦 Yêu Cầu Trả Hàng</button>
          <button class="btn-action-fraud-freeze" id="act-freeze">🔒 Khóa & Báo Fraud</button>
        </div>
      </div>
    `;

    // Staff Actions Listeners
    setupStaffActionButtons(c);
  }

  function setupStaffActionButtons(c) {
    const actApprove = document.getElementById('act-approve');
    const actMoreInfo = document.getElementById('act-more-info');
    const actReject = document.getElementById('act-reject');
    const actFreeze = document.getElementById('act-freeze');

    async function sendAudit(actName) {
      const noteInput = document.getElementById('staff-note');
      const note = noteInput?.value || '';
      try {
        if (window.location.protocol.startsWith('http')) {
          await fetch('/api/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId: c.id, action: actName, note })
          });
        }
      } catch (err) {
        // Ignored in static mode
      }
      // Cập nhật trạng thái hiển thị của đơn hàng
      c.status = actName;
      if (testCasesData[c.id]) {
        testCasesData[c.id].status = actName;
      }
      renderDashboardQueue();
    }

    if (actApprove) {
      actApprove.addEventListener('click', (e) => {
        e.preventDefault();
        sendAudit('Đã phê duyệt hoàn tiền');
        showToast('Đã Phê Duyệt Hoàn Tiền', `Đơn #${c.order.code} (${c.name}) được duyệt hoàn ${c.order.priceFormatted} về ShopeePay! Dữ liệu đã lưu vào Feedback Loop & SQL Server.`, 'success');
      });
    }

    if (actMoreInfo) {
      actMoreInfo.addEventListener('click', (e) => {
        e.preventDefault();
        sendAudit('Yêu cầu bổ sung video');
        showToast('Yêu Cầu Bổ Sung Bằng Chứng', `Đã gửi thông báo yêu cầu cung cấp video mở hộp đến khách hàng #${c.custId}. Dữ liệu đã lưu vào SQL Server.`, 'warning');
      });
    }

    if (actReject) {
      actReject.addEventListener('click', (e) => {
        e.preventDefault();
        sendAudit('Yêu cầu gửi trả hàng');
        showToast('Yêu Cầu Trả Hàng', `Đã tạo mã vận đơn trả hàng SPX Express cho khách #${c.custId}. Cần nhận hàng trước khi hoàn tiền.`, 'info');
      });
    }

    if (actFreeze) {
      actFreeze.addEventListener('click', (e) => {
        e.preventDefault();
        sendAudit('Đã khóa gian lận (Fraud Ring)');
        showToast('Cảnh Báo Gian Lận', `Đã chặn khiếu nại #${c.order.code} và đưa thiết bị/IP vào danh sách giám sát Fraud Ring trong SQL Server!`, 'danger', 5000);
      });
    }
  }

  // ==================== CSV EXPORT FUNCTION ====================
  function exportQueueToCSV() {
    const allCases = Object.values(testCasesData);
    const query = currentSearchQuery.trim().toLowerCase();
    const visibleCases = allCases.filter(item => {
      const matchFilter = (currentDashboardFilter === 'all' || item.riskLevel === currentDashboardFilter);
      if (!query) return matchFilter;
      const matchSearch = item.name.toLowerCase().includes(query) ||
                          item.order.code.toLowerCase().includes(query) ||
                          item.order.product.toLowerCase().includes(query) ||
                          item.custId.toLowerCase().includes(query) ||
                          item.riskLabel.toLowerCase().includes(query);
      return matchFilter && matchSearch;
    });

    if (visibleCases.length === 0) {
      showToast('Thông Báo', 'Không có dữ liệu đơn hàng nào để xuất file!', 'warning');
      return;
    }

    // UTF-8 BOM (\uFEFF) giúp mở trực tiếp bằng Excel tiếng Việt không bị lỗi font ký tự
    let csvContent = '\uFEFF';
    csvContent += 'Mã Hồ Sơ,Mã Khách Hàng,Tên Khách Hàng,Sản Phẩm,Giá Trị Đơn,Điểm Rủi Ro (%),Phân Loại AI,Đề Xuất Xử Lý,Lý Do Khiếu Nại\n';

    visibleCases.forEach(c => {
      const row = [
        `"${c.order.code}"`,
        `"${c.custId}"`,
        `"${c.name}"`,
        `"${c.order.product.replace(/"/g, '""')}"`,
        `"${c.order.priceFormatted}"`,
        `"${c.riskScore}%"`,
        `"${c.riskLabel}"`,
        `"${c.aiRecommendation.replace(/"/g, '""')}"`,
        `"${c.reason.replace(/"/g, '""')}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `Shopee_AI_Fraud_Report_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Xuất Báo Cáo Thành Công', `Đã xuất ${visibleCases.length} hồ sơ thẩm định ra file Shopee_AI_Fraud_Report_${timestamp}.csv!`, 'success');
  }

  // Live Search Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = currentSearchQuery ? 'block' : 'none';
      }
      renderDashboardQueue();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderDashboardQueue();
      searchInput.focus();
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportQueueToCSV);
  }

  // Filter Pills in Dashboard
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filterType = pill.dataset.filter || 'all';
      renderDashboardQueue(filterType);
    });
  });

  // Helpers
  function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  function scrollChatToBottom() {
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  // ==================== INITIALIZE APP ====================
  async function initApp() {
    try {
      if (window.location.protocol.startsWith('http')) {
        const resp = await fetch('/api/cases');
        if (resp.ok) {
          const json = await resp.json();
          if (json && json.data && Object.keys(json.data).length > 0) {
            Object.assign(testCasesData, json.data);
            console.log('⚡ Đang nạp dữ liệu từ Backend:', json.source);
          }
        }
      }
    } catch (e) {
      // Static fallback
    }
    loadTestCase(1);
  }

  initApp();
});
