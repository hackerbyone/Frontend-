export default function Footer() {
  return (
    <footer className="bg-primary-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-bold mb-3 text-base">Về chúng tôi</h4>
          <p className="text-gray-300 leading-relaxed">
            Văn Phòng Phẩm Online - chuyên cung cấp dụng cụ học tập, văn phòng chính hãng, giá tốt, giao hàng toàn quốc.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-base">Hỗ trợ khách hàng</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Hướng dẫn mua hàng</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách vận chuyển</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-base">Chính sách</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Bảo mật thông tin</li>
            <li>Điều khoản sử dụng</li>
            <li>Thanh toán</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-base">Liên hệ</h4>
          <ul className="space-y-2 text-gray-300">
            <li>📞 Hotline: 0827027392 </li>
            <li>📧 support@vanphongpham.vn</li>
            <li>📍 Thới Bình, Cà Mau</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-700 py-4 text-center text-xs text-gray-400">
        © 2026 Văn Phòng Phẩm Online. All rights reserved.
      </div>
    </footer>
  )
}
