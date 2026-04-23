# AI Office Mastery — Landing Page

Landing page đăng ký khóa học AI cho dân văn phòng, tích hợp Google Sheets.

## Cấu trúc

```
├── index.html        ← Toàn bộ website (HTML + CSS + JS)
├── apps-script.js    ← Code Google Apps Script (copy-paste vào Google)
├── vercel.json       ← Config deploy Vercel
└── README.md
```

---

## Hướng dẫn cài đặt

### Bước 1: Tạo Google Apps Script

1. Mở [Google Sheets](https://sheets.google.com) → tạo spreadsheet mới
2. Vào **Extensions → Apps Script**
3. Xoá code mặc định, dán toàn bộ nội dung `apps-script.js` vào
4. Click **Deploy → New deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Nhấn **Deploy** → Copy URL

### Bước 2: Cập nhật URL vào website

Mở `index.html`, tìm dòng:
```js
const SCRIPT_URL = 'ĐẶT_URL_APPS_SCRIPT_VÀO_ĐÂY';
```
Thay bằng URL vừa copy từ Apps Script.

### Bước 3: Deploy lên GitHub + Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-office-mastery.git
git push -u origin main
```

Sau đó vào [vercel.com](https://vercel.com) → Import repo → Deploy tự động.

---

## Luồng hoạt động

```
User điền form → POST lên Apps Script → Lưu vào Google Sheets
                                       → Hiện modal thành công
                                       → User click → Vào nhóm Zalo
```

## Tùy chỉnh

- **Link Zalo nhóm**: Tìm `https://zalo.me/g/...` trong `index.html` để thay link khác
- **Giá khóa học**: Tìm `2.990.000đ` để cập nhật
- **Hotline**: Tìm `0966 123 456` để thay số thật
