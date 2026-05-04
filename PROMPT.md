# Prompt Xây Dựng Website Thương Mại Điện Tử Văn Phòng Phẩm

Hãy hướng dẫn tôi xây dựng một website thương mại điện tử bán văn phòng phẩm với các yêu cầu sau:

## Công Nghệ Sử Dụng

- **Vite + React 18** (JavaScript) - Build tool và framework
- **React Router DOM v6** - Quản lý routing/điều hướng
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - Quản lý state (Auth và Cart)
- **Axios** - HTTP client cho API calls
- **PostCSS** - Xử lý CSS cho Tailwind

## Cấu Trúc Trang

### Trang Khách Hàng

1. **Trang Chủ (Home)** - Hiển thị sản phẩm nổi bật, danh mục
2. **Danh Sách Sản Phẩm (ProductList)** - Lọc theo danh mục, nhà sản xuất, tìm kiếm
3. **Chi Tiết Sản Phẩm (ProductDetail)** - Thông tin chi tiết, thêm vào giỏ hàng
4. **Giỏ Hàng (Cart)** - Quản lý sản phẩm trong giỏ, cập nhật số lượng, xóa
5. **Thanh Toán (Checkout)** - Form nhập thông tin giao hàng
6. **Đăng Nhập/Đăng Ký (Login, Register)** - Xác thực người dùng
7. **Đơn Hàng Của Tôi (MyOrders)** - Lịch sử đặt hàng
8. **Thành Công (OrderSuccess)** - Trang xác nhận đặt hàng thành công

### Trang Admin

1. **Dashboard (AdminDashboard)** - Thống kê tổng quan
2. **Quản Lý Sản Phẩm (AdminProducts)** - CRUD sản phẩm
3. **Quản Lý Đơn Hàng (AdminOrders)** - Xem, cập nhật trạng thái đơn hàng
4. **Quản Lý Nhà Sản Xuất (AdminManufacturers)** - CRUD nhà sản xuất

## API Endpoints Giả Định

```
GET    /products           - Lấy danh sách sản phẩm (có phân trang, lọc)
GET    /products/:id       - Chi tiết sản phẩm
POST   /products           - Thêm sản phẩm mới (Admin)
PUT    /products/:id       - Cập nhật sản phẩm (Admin)
DELETE /products/:id       - Xóa sản phẩm (Admin)

GET    /categories         - Lấy danh sách danh mục
POST   /categories         - Thêm danh mục (Admin)
PUT    /categories/:id     - Cập nhật danh mục (Admin)
DELETE /categories/:id     - Xóa danh mục (Admin)

GET    /manufacturers      - Lấy danh sách nhà sản xuất
POST   /manufacturers      - Thêm nhà sản xuất (Admin)
PUT    /manufacturers/:id  - Cập nhật nhà sản xuất (Admin)
DELETE /manufacturers/:id  - Xóa nhà sản xuất (Admin)

GET    /orders             - Lấy danh sách đơn hàng (Admin)
GET    /orders/:id          - Chi tiết đơn hàng
POST   /orders             - Tạo đơn hàng mới
GET    /orders/user/:userId - Đơn hàng của user
PUT    /orders/:id/status   - Cập nhật trạng thái (Admin)

POST   /auth/login          - Đăng nhập
POST   /auth/register       - Đăng ký
GET    /auth/me             - Lấy thông tin user hiện tại
```

## Tính Năng Chính

### Khách Hàng

- Xem sản phẩm với hình ảnh, giá, mô tả
- Lọc sản phẩm theo danh mục và nhà sản xuất
- Tìm kiếm sản phẩm theo tên
- Xem chi tiết sản phẩm
- Thêm/bớt sản phẩm vào giỏ hàng
- Cập nhật số lượng trong giỏ hàng
- Xóa sản phẩm khỏi giỏ hàng
- Đặt hàng với thông tin giao hàng (họ tên, sdt, địa chỉ)
- Xem lịch sử đơn hàng
- Đăng ký / Đăng nhập tài khoản

### Admin

- Xem thống kê dashboard (tổng sản phẩm, đơn hàng, doanh thu)
- Thêm/Sửa/Xóa sản phẩm (tên, giá, hình ảnh, mô tả, danh mục, nhà sản xuất)
- Xem danh sách đơn hàng
- Cập nhật trạng thái đơn hàng (Chờ xác nhận, Đang giao, Đã giao, Đã hủy)
- Thêm/Sửa/Xóa nhà sản xuất

## Cấu Trúc Thư Mục

```
vanphongpham/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/
    │   ├── axiosClient.js      # Cấu hình Axios base
    │   ├── productApi.js       # API sản phẩm
    │   ├── categoryApi.js      # API danh mục
    │   ├── manufacturerApi.js   # API nhà sản xuất
    │   ├── orderApi.js         # API đơn hàng
    │   └── authApi.js          # API xác thực
    ├── contexts/
    │   ├── AuthContext.jsx     # Context đăng nhập/đăng ký
    │   └── CartContext.jsx     # Context giỏ hàng
    ├── components/
    │   ├── Header.jsx          # Header với logo, menu, giỏ hàng
    │   ├── Footer.jsx          # Footer
    │   ├── ProductCard.jsx     # Card hiển thị sản phẩm
    │   └── Loading.jsx         # Component loading
    ├── pages/
    │   ├── Home.jsx
    │   ├── ProductList.jsx
    │   ├── ProductDetail.jsx
    │   ├── Cart.jsx
    │   ├── Checkout.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── MyOrders.jsx
    │   ├── OrderSuccess.jsx
    │   ├── NotFound.jsx
    │   ├── AdminDashboard.jsx
    │   ├── AdminProducts.jsx
    │   ├── AdminOrders.jsx
    │   └── AdminManufacturers.jsx
    └── utils/
        └── format.js           # Hàm format tiền tệ, ngày tháng
```

## Yêu Cầu Code

1. Cấu hình đầy đủ Vite, Tailwind CSS, React Router
2. Tạo API service với Axios có interceptors cho token
3. Tạo AuthContext để quản lý user login, role (user/admin)
4. Tạo CartContext để quản lý giỏ hàng (thêm, bớt, cập nhật, xóa, tính tổng)
5. Component Header có: logo, navigation menu, giỏ hàng với số lượng, user menu
6. Component ProductCard hiển thị: hình ảnh, tên, giá, nút thêm giỏ hàng
7. Trang ProductList: hiển thị grid sản phẩm, bộ lọc sidebar, thanh tìm kiếm, phân trang
8. Protected Routes: chỉ admin mới vào được trang admin
9. Trang Checkout: form nhập thông tin giao hàng, xem lại giỏ hàng
10. Toast/Alert thông báo khi thành công hoặc lỗi

## Ví Dụ Data

### Sản Phẩm

```json
{
  "id": 1,
  "name": "Bút Bi Thiên Long TL-059",
  "price": 5000,
  "image": "https://...",
  "description": "Bút bi mực xanh, viết mượt",
  "categoryId": 1,
  "manufacturerId": 1,
  "stock": 100
}
```

### Danh Mục

```json
[
  { "id": 1, "name": "Bút" },
  { "id": 2, "name": "Giấy" },
  { "id": 3, "name": "Sổ" },
  { "id": 4, "name": "Dụng cụ văn phòng" }
]
```

### Nhà Sản Xuất

```json
[
  { "id": 1, "name": "Thiên Long" },
  { "id": 2, "name": "Pilot" },
  { "id": 3, "name": "Deli" }
]
```

---

Hãy hướng dẫn từng bước với code đầy đủ cho từng file, giải thích rõ ràng cách hoạt động.
