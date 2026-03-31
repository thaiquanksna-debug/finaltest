// src/components/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Header({ onSearch, onCategory, onSort }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất!');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(search);
  };

  return (
    <>
      {/* Top bar */}
      <div style={{ background: '#1a1a2e', color: 'white', padding: '6px 0', fontSize: '13px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📞 0819 480 680</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            {user ? (
              <>
                <span>👤 {user.name}</span>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ color: '#ffd700' }}>⚙️ Admin</Link>
                )}
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'white' }}>ĐĂNG NHẬP</Link>
                <Link to="/register" style={{ color: 'white', background: '#e74c3c', padding: '2px 10px', borderRadius: '4px' }}>ĐĂNG KÝ</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header style={{ background: 'white', padding: '12px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🛒</span>
            <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#e74c3c' }}>ThQuanShop</span>
          </Link>

          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex' }}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '10px 16px', border: '2px solid #eee', borderRadius: '8px 0 0 8px', outline: 'none', fontSize: '14px' }}
            />
            <button type="submit" style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '0 8px 8px 0', cursor: 'pointer' }}>
              🔍
            </button>
          </form>

          <Link to="/cart" style={{ position: 'relative', textDecoration: 'none', fontSize: '28px' }}>
            🛒
            {cart.length > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: '#e74c3c', color: 'white', borderRadius: '50%',
                width: '20px', height: '20px', fontSize: '11px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {/* Filter bar */}
        <div className="container" style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <select onChange={e => onCategory && onCategory(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>
            <option value="all">Tất cả danh mục</option>
            <option value="phone">Điện thoại</option>
            <option value="laptop">Laptop</option>
            <option value="tablet">Tablet</option>
            <option value="accessory">Phụ kiện</option>
          </select>

          <select onChange={e => onSort && onSort(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>
            <option value="">Sắp xếp mặc định</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>
      </header>
    </>
  );
}