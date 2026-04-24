// ============================================================
// AI Office Mastery — Google Apps Script (v5 - Imgur)
// ============================================================

const ZALO_LINK    = 'https://zalo.me/g/t4qzkobj0mcp5whnnugk';
const NOTIFY_EMAIL = 'songlamchaymai@gmail.com';
const DRIVE_FOLDER_ID  = '1akg7legddeu2KVMXnRazM5s3gG7hCfHU';
const TELEGRAM_TOKEN   = '8651861573:AAEd2jGxFzT2ubRobnglnE1L4GHquDYkcas';
const TELEGRAM_CHAT_ID = '5083589789';

// ============================================================
function doGet(e) {
  try {
    const p = e.parameter || {};
    if (p.name && p.phone && p.email) {
      return handleRegister(p.name, p.phone, p.email, p.billUrl || '');
    }
    return json({ status: 'ok', message: 'API v5 running' });
  } catch(err) {
    return json({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  try {
    const p = e.parameter || {};
    const name    = (p.name    || '').trim();
    const phone   = (p.phone   || '').trim();
    const email   = (p.email   || '').trim();
    const billUrl = (p.billUrl || '').trim();
    return handleRegister(name, phone, email, billUrl);
  } catch(err) {
    return json({ status: 'error', message: err.toString() });
  }
}

// ============================================================
function handleRegister(name, phone, email, billUrl) {
  name  = (name  || '').trim();
  phone = (phone || '').trim();
  email = (email || '').trim();

  if (!name || !phone || !email) {
    return json({ status: 'error', message: 'Thiếu thông tin' });
  }

  const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  // 1. Lưu vào Google Sheets (có cột Link ảnh bill)
  getOrCreateSheet().appendRow([time, name, phone, email, billUrl || '(không có ảnh)']);

  // 2. Nếu có link ảnh Imgur → tải về và lưu vào Drive
  if (billUrl) {
    try {
      var response = UrlFetchApp.fetch(billUrl);
      var blob = response.getBlob();
      var safeName = name.replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, '_');
      blob.setName('bill_' + safeName + '_' + phone + '_' + Date.now() + '.jpg');
      DriveApp.getFolderById(DRIVE_FOLDER_ID).createFile(blob);
    } catch(err) {
      console.error('Drive save error:', err);
    }
  }

  // 3. Email xác nhận cho học viên
  sendConfirmEmail(name, email);

  // 4. Thông báo admin (Email + Telegram)
  sendAdminNotify(name, phone, email, time, billUrl);
  sendTelegram(name, phone, email, time, billUrl);

  return json({ status: 'ok' });
}

// ============================================================
function sendConfirmEmail(name, email) {
  MailApp.sendEmail({
    to: email,
    subject: '🎉 [AI Office Mastery] Đăng ký thành công – Nhận lịch học ngay!',
    name: 'AI Office Mastery',
    htmlBody: `<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#0ea5e9,#0284c7);padding:36px 40px;text-align:center;">
    <p style="color:rgba(255,255,255,0.9);font-size:13px;font-weight:700;letter-spacing:1px;margin:0 0 6px;text-transform:uppercase;">AI Office Mastery</p>
    <h1 style="color:white;font-size:26px;font-weight:900;margin:0 0 8px;">Đăng ký thành công! 🎉</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0;">Chúng tôi đã nhận được thông tin của bạn</p>
  </td></tr>
  <tr><td style="padding:36px 40px;">
    <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">Xin chào <strong>${name}</strong>,</p>
    <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;">
      Cảm ơn bạn đã đăng ký <strong>Khóa học AI Office Mastery</strong>!
      Admin sẽ xác nhận thanh toán trong vòng <strong>24 giờ</strong>.
    </p>
    <div style="background:#f0fdf4;border-radius:14px;padding:20px 24px;margin-bottom:24px;border-left:4px solid #10b981;">
      <p style="font-size:14px;font-weight:800;color:#065f46;margin:0 0 12px;">📋 Bước tiếp theo:</p>
      <p style="font-size:14px;color:#334155;margin:0 0 8px;">① Vào nhóm Zalo để nhận lịch học</p>
      <p style="font-size:14px;color:#334155;margin:0 0 8px;">② Nhận tài liệu + prompt mẫu từ giảng viên</p>
      <p style="font-size:14px;color:#334155;margin:0;">③ Admin xác nhận thanh toán trong 24h</p>
    </div>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${ZALO_LINK}" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:17px;font-weight:800;">
        💬 Vào nhóm Zalo ngay
      </a>
    </div>
    <p style="font-size:14px;color:#64748b;margin:0;">
      Hotline <strong>0966 123 456</strong> hoặc
      <a href="mailto:info@aiofficemastery.vn" style="color:#0ea5e9;">info@aiofficemastery.vn</a>
    </p>
  </td></tr>
  <tr><td style="background:#f8fafc;padding:16px 40px;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="font-size:12px;color:#94a3b8;margin:0;">© 2024 AI Office Mastery</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`
  });
}

// ============================================================
function sendAdminNotify(name, phone, email, time, billUrl) {
  if (!NOTIFY_EMAIL) return;
  const billHtml = billUrl
    ? `<tr><td style="padding:6px 16px 6px 0;color:#64748b;">Ảnh bill</td><td><a href="${billUrl}" style="color:#0ea5e9;">Xem ảnh</a></td></tr>`
    : '<tr><td style="padding:6px 16px 6px 0;color:#64748b;">Ảnh bill</td><td style="color:#ef4444;">Không có</td></tr>';
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `💰 Học viên mới: ${name} – ${phone}`,
    name: 'AI Office Mastery System',
    htmlBody: `<p style="font-family:Arial;font-size:15px;font-weight:700;">Học viên mới đăng ký:</p>
    <table style="font-family:Arial;font-size:14px;">
      <tr><td style="padding:6px 16px 6px 0;color:#64748b;">Thời gian</td><td style="font-weight:600;">${time}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#64748b;">Họ tên</td><td style="font-weight:600;">${name}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#64748b;">Số điện thoại</td><td style="font-weight:600;">${phone}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#64748b;">Email</td><td style="font-weight:600;">${email}</td></tr>
      ${billHtml}
    </table>`
  });
}

// ============================================================
function sendTelegram(name, phone, email, time, billUrl) {
  try {
    var text = '🔔 <b>Học viên mới đăng ký!</b>'
      + '\n👤 <b>Tên:</b> ' + name
      + '\n📞 <b>SĐT:</b> ' + phone
      + '\n📧 <b>Email:</b> ' + email
      + '\n⏰ <b>Thời gian:</b> ' + time;

    // Gửi text
    UrlFetchApp.fetch(
      'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage',
      {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text, parse_mode: 'HTML' })
      }
    );

    // Gửi ảnh bill riêng nếu có
    if (billUrl) {
      UrlFetchApp.fetch(
        'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendPhoto',
        {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo:   billUrl,
            caption: '📸 Ảnh bill của ' + name
          })
        }
      );
    }
  } catch(err) {
    console.error('Telegram error:', err);
  }
}

// ============================================================
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName('DangKy');
  if (!s) {
    s = ss.insertSheet('DangKy');
    s.getRange(1,1,1,5).setValues([['Thời gian','Họ tên','Số điện thoại','Email','Link ảnh bill']]);
    s.getRange(1,1,1,5).setFontWeight('bold').setBackground('#0ea5e9').setFontColor('white');
    s.setColumnWidths(1,5,180);
    s.setFrozenRows(1);
  }
  return s;
}

function testDrive() {
  var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  folder.createFile('test2.txt', 'Drive OK v5!');
  Logger.log('Drive OK!');
}

function testTelegram() {
  sendTelegram('Nguyễn Test', '0912345678', 'test@gmail.com', 
    new Date().toLocaleString('vi-VN'), '');
  Logger.log('Telegram sent!');
}
