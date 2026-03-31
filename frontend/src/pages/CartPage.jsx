import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fmt = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thanh toán!');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '60px', marginBottom: '16px' }}>🛒</div>
      <h2 style={{ color: '#333', marginBottom: '12px' }}>Giỏ hàng trống</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Hãy thêm sản phẩm vào giỏ hàng</p>
      <Link to="/" style={{ background: '#e74c3c', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
        Tiếp tục mua sắm
      </Link>
    </div>
  );

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>🛒 Giỏ hàng ({cart.length} sản phẩm)</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cart.map(item => {
            const itemPrice = item.price * (1 - (item.discount || 0) / 100);
            return (
              <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  onError={e => e.target.src = 'https://via.placeholder.com/80?text=No+Image'} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>{item.name}</h4>
                  <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{fmt(itemPrice)}</span>
                  {item.discount > 0 && <span style={{ color: '#999', textDecoration: 'line-through', marginLeft: '8px', fontSize: '12px' }}>{fmt(item.price)}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '16px' }}>-</button>
                  <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '16px' }}>+</button>
                </div>
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{fmt(itemPrice * item.quantity)}</div>
                  <button onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '12px', marginTop: '4px' }}>🗑 Xóa</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>Tổng đơn hàng</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666' }}>
            <span>Tạm tính:</span><span>{fmt(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#27ae60' }}>
            <span>Phí ship:</span><span>Miễn phí</span>
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: '#e74c3c', marginBottom: '20px' }}>
            <span>Tổng:</span><span>{fmt(total)}</span>
          </div>
          <button onClick={handleCheckout}
            style={{ width: '100%', padding: '14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            💳 Thanh toán
          </button>
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '12px', color: '#666', textDecoration: 'none', fontSize: '14px' }}>
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}