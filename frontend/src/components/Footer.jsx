// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1a1a2e', color: 'white', padding: '40px 0 20px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>🛒</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#e74c3c' }}>ThQuanShop</span>
          </div>
          <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6 }}>
            Cửa hàng điện tử uy tín, chất lượng cao. Cam kết hàng chính hãng, bảo hành đầy đủ.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '12px', color: '#e74c3c' }}>LIÊN KẾT NHANH</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Trang chủ</Link>
            <Link to="/cart" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Giỏ hàng</Link>
            <Link to="/orders" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Đơn hàng</Link>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '12px', color: '#e74c3c' }}>HỖ TRỢ KHÁCH HÀNG</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#aaa', fontSize: '14px' }}>
            <span>Chính sách đổi trả</span>
            <span>Bảo hành sản phẩm</span>
            <span>Hướng dẫn mua hàng</span>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '12px', color: '#e74c3c' }}>LIÊN HỆ</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#aaa', fontSize: '14px' }}>
            <span>📞 0819 480 680</span>
            <span>📧 thquanshop@gmail.com</span>
            <span>📍 TP. Hồ Chí Minh</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #333', marginTop: '24px', paddingTop: '16px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
        © 2025 ThQuanShop. All rights reserved.
      </div>
    </footer>
  );
}