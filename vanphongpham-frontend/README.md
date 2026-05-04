# Văn Phòng Phẩm Online - Frontend

Trang web bán văn phòng phẩm cho **người dùng cuối**, kết nối tới backend ASP.NET Core (BaseCoreSales). Phong cách giao diện tham khảo thienlong.vn — màu xanh dương chủ đạo + cam nhấn.

## Tính năng

- Trang chủ: banner, danh mục nổi bật, sản phẩm mới
- Danh sách sản phẩm theo danh mục, có sidebar lọc
- Tìm kiếm theo từ khoá
- Chi tiết sản phẩm + sản phẩm liên quan
- Giỏ hàng (lưu localStorage, không mất khi F5)
- Đặt hàng (Checkout) → gọi API tạo `Order` + `OrderDetails`
- Đăng ký / Đăng nhập (gọi `BaseCore.AuthService`)

## Đồng bộ realtime với admin

Frontend **không có database riêng**. Mỗi lần render trang, nó gọi REST API tới backend → khi admin thay đổi (sửa giá, thêm sản phẩm, đổi mô tả) trong database → người dùng cuối F5 (hoặc chuyển trang) là **thấy ngay**.

## Cấu trúc thư mục

```
vanphongpham-frontend/
├── public/
├── src/
│   ├── api/                 # Tầng gọi API
│   │   ├── axiosClient.js   # Axios chung + interceptor JWT
│   │   ├── productApi.js
│   │   ├── categoryApi.js
│   │   ├── orderApi.js
│   │   └── authApi.js
│   ├── components/          # Component dùng chung
│   │   ├── Header.jsx       # Logo, search, menu, giỏ hàng
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── Loading.jsx
│   ├── contexts/            # State toàn cục
│   │   ├── AuthContext.jsx  # Đăng nhập / token
│   │   └── CartContext.jsx  # Giỏ hàng
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductList.jsx  # Dùng cho /products, /category/:id, /search
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── NotFound.jsx
│   ├── utils/format.js
│   ├── App.jsx              # Routing
│   ├── main.jsx             # Entry
│   └── index.css            # Tailwind + global
├── index.html
├── vite.config.js           # Có proxy /api → backend
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Cài đặt

```bash
cd vanphongpham-frontend
npm install
```

## Cấu hình backend URL

Mở `vite.config.js`, sửa `target` thành URL backend của bạn:

```js
proxy: {
  '/api': {
    target: 'https://localhost:5001', // ApiGateway hoặc APIService
    changeOrigin: true,
    secure: false,
  },
},
```

Hoặc tạo file `.env` ở thư mục gốc:

```
VITE_API_URL=https://localhost:5001/api
```

## Chạy dev

```bash
npm run dev
```

Mở http://localhost:3000

## Build production

```bash
npm run build
```

File tĩnh nằm trong thư mục `dist/`. Có thể deploy lên IIS, Nginx, hoặc serve cùng backend ASP.NET Core.

## Các endpoint backend cần có

Frontend đang giả định backend có những route sau (sửa trong `src/api/*.js` nếu khác):

| Method | Endpoint | Mô tả |
|---|---|---|
| GET  | `/api/Product` | Danh sách sản phẩm (params: categoryId, search, pageSize) |
| GET  | `/api/Product/{id}` | Chi tiết sản phẩm |
| GET  | `/api/Category` | Danh sách danh mục |
| GET  | `/api/Category/{id}` | Chi tiết danh mục |
| POST | `/api/Order` | Tạo đơn hàng (kèm OrderDetails) |
| GET  | `/api/Order/user/{userId}` | Đơn hàng theo user |
| POST | `/api/Auth/login` | Đăng nhập (trả JWT) |
| POST | `/api/Auth/register` | Đăng ký |

## Lưu ý CORS

Backend ASP.NET Core cần bật CORS cho origin `http://localhost:3000` khi dev:

```csharp
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:3000")
     .AllowAnyHeader()
     .AllowAnyMethod()));

app.UseCors();
```

Hoặc dùng proxy của Vite (đã có sẵn) để tránh CORS hoàn toàn.
