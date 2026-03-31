import { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';

const fmt = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const STATUS_LABEL = {
  pending: { label: 'Chờ xử lý', color: '#f39c12' },
  processing: { label: 'Đang xử lý', color: '#3498db' },
  shipping: { label: 'Đang giao', color: '#9b59b6' },
  delivered: { label: 'Đã giao', color: '#27ae60' },
  cancelled: { label: 'Đã hủy', color: '#e74c3c' },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      toast.error('Không thể tải đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng?')) return;
    try {
      await orderService.cancel(id);
      toast.success('Đã hủy đơn hàng!');
      loadOrders();
    } catch (err) {
      toast.error(err.message || 'Không thể hủy đơn!');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>⏳ Đang tải...</div>;

  if (orders.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '60px', marginBottom: '16px' }}>📦</div>
      <h2 style={{ color: '#333', marginBottom: '12px' }}>Chưa có đơn hàng</h2>
    </div>
  );

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>📦 Đơn Hàng Của Tôi</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.map(order => {
          const status = STATUS_LABEL[order.status] || STATUS_LABEL.pending;
          return (
            <div key={order._id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#999' }}>Mã đơn: </span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <span style={{ background: status.color + '20', color: status.color, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                  {status.label}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {order.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' }}>
                    <span>{item.product?.name || 'Sản phẩm'} x{item.quantity}</span>
                    <span>{fmt(item.price * (1 - (item.discount || 0) / 100) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#e74c3c', fontSize: '16px' }}>Tổng: {fmt(order.totalAmount)}</span>
                {order.status === 'pending' && (
                  <button onClick={() => handleCancel(order._id)}
                    style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    Hủy đơn
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}