// ============================================================
// AI Office Mastery — Google Apps Script
// Dán code này vào Google Apps Script và deploy
// ============================================================

function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName('DangKy');

    // Tạo sheet nếu chưa có
    const activeSheet = sheet || createSheet();

    const name  = e.parameter.name  || '';
    const phone = e.parameter.phone || '';
    const email = e.parameter.email || '';
    const time  = e.parameter.time  || new Date().toLocaleString('vi-VN');

    // Lưu vào Sheet
    activeSheet.appendRow([time, name, phone, email]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'AI Office Mastery API running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('DangKy');
  // Header row
  sheet.getRange(1, 1, 1, 4).setValues([['Thời gian', 'Họ tên', 'Số điện thoại', 'Email']]);
  sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#0ea5e9').setFontColor('white');
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 220);
  return sheet;
}

// ============================================================
// HƯỚNG DẪN DEPLOY:
//
// 1. Mở Google Sheets → Extensions → Apps Script
// 2. Xoá code cũ, dán toàn bộ code này vào
// 3. Click Deploy → New deployment
//    - Type: Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Copy URL vừa tạo
// 5. Mở index.html → tìm dòng:
//      const SCRIPT_URL = 'ĐẶT_URL_APPS_SCRIPT_VÀO_ĐÂY';
//    Thay bằng URL vừa copy
// 6. Lưu file và push lên GitHub
// ============================================================
