# Ghi chú: thay đổi môi trường chạy cục bộ (không phải thay đổi UI/logic)

**Ngày:** 15/11/2026
**Lý do:** máy thực hiện đã có một ứng dụng Next.js khác chiếm `localhost:3000`, nên backend EShop không thể bind port mặc định.

## Thay đổi duy nhất

| File | Trước | Sau |
| :--- | :--- | :--- |
| `backend/server.js` | `const PORT = 3000;` | `const PORT = process.env.PORT || 3001;` |
| `frontend-web/src/**/*.jsx` (7 file) | `http://localhost:3000` | `http://localhost:3001` |
| `frontend-admin/src/App.jsx` | `http://localhost:3000` | `http://localhost:3001` |
| `frontend-mobile/App.js` | `http://192.168.10.13:3000` | `http://192.168.1.45:3001` (IP LAN hiện tại) |

**Không thay đổi:** JSX, CSS, validation, API path, dữ liệu seed, business logic.

**Kiểm chứng:** `GET http://localhost:3001/api/products` → `200`, 5 sản phẩm seed.

> Ghi chú này để TA đối chiếu: mọi screenshot trong bài đều dùng `localhost:3001` (API) và `localhost:5173/5174` (UI). Đây là cùng một SUT, chỉ khác cổng do môi trường.
