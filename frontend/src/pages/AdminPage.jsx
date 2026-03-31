import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import orderService from '../services/orderService';
import { apiCall } from '../services/api';
import toast from 'react-hot-toast';

const fmt = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const EMPTY_PRODUCT = { name: '', price: '', category: 'phone', image: '', description: '', stock: '', discount: 0 };

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_PRODUCT);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    loadAll();
  }, [user]);

  const loadAll = () => {
    productService.getAll().then(setProducts).catch(() => {});
    orderService.getAll().then(setOrders).catch(() => {});
    apiCall('/users').then(d => setUsers(d.users || [])).catch(() => {});
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, price: Number(form.price), stock: Number(form.stock), discount: Number(form.discount) };
      if (editProduct) {
        await productService.update(editProduct._id, data);
        toast.success('Cập nhật thành công!');
      } else {
        await productService.create(data);
        toast.success('Thêm sản phẩm thành công!');
      }
      setShowForm(false); setEditProduct(null); setForm(EMPTY_PRODUCT);
      productService.getAll().then(setProducts);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    try {
      await productService.delete(id);
      toast.success('Đã xóa!');
      productService.getAll().then(setProducts);
    } catch (err) { toast.error(err.message); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      toast.success('Cập nhật trạng thái!');
      orderService.getAll().then(setOrders);
    } catch (err) { toast.error(err.message); }
  };

  const TAB_STYLE = (active) => ({
    padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
    background: active ? '#e74c3c' : '#f5f5f5', color: active ? 'white' : '#555'
  });

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>⚙️ Trang Quản Trị</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['products', 'orders', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={TAB_STYLE(tab === t)}>
            {t === 'products' ? '📦 Sản phẩm' : t === 'orders' ? '🧾 Đơn hàng' : '👥 Người dùng'}
            <span style={{ marginLeft: '6px', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', padding: '0 6px', fontSize: '12px' }}>
              {t === 'products' ? products.length : t === 'orders' ? orders.length : users.length}
            </span>
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ color: '#333' }}>Danh sách sản phẩm</h3>
            <button onClick={() => { setShowForm(true); setEditProduct(null); setForm(EMPTY_PRODUCT); }}
              style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              + Thêm sản phẩm
            </button>
          </div>

          {showForm && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '16px' }}>{editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h4>
              <form onSubmit={handleSubmitProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Tên sản phẩm', name: 'name', type: 'text' },
                  { label: 'Giá (VND)', name: 'price', type: 'number' },
                  { label: 'Tồn kho', name: 'stock', type: 'number' },
                  { label: 'Giảm giá (%)', name: 'discount', type: 'number' },
                  { label: 'Hình ảnh (URL)', name: 'image', type: 'text' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>{f.label}</label>
                    <input type={f.type} value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })} required={f.name !== 'discount' && f.name !== 'image'}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Danh mục</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                    <option value="phone">Điện thoại</option>
                    <option value="laptop">Laptop</option>
                    <option value="tablet">Tablet</option>
                    <option value="accessory">Phụ kiện</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Mô tả</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{ padding: '10px 24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                    {editProduct ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditProduct(null); }}
                    style={{ padding: '10px 24px', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9f9f9' }}>
                <tr>{['Ảnh', 'Tên', 'Giá', 'Danh mục', 'Tồn', 'Thao tác'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#555', fontWeight: '600' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px' }}><img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} onError={e => e.target.src = 'https://via.placeholder.com/50'} /></td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', maxWidth: '200px' }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#e74c3c', fontWeight: '600' }}>{fmt(p.price)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.category}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.stock}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => { setEditProduct(p); setForm({ ...p }); setShowForm(true); }}
                        style={{ padding: '6px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}>Sửa</button>
                      <button onClick={() => handleDelete(p._id)}
                        style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9f9f9' }}>
              <tr>{['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Cập nhật'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#555', fontWeight: '600' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>{o._id.slice(-8).toUpperCase()}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{o.user?.name || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#e74c3c', fontWeight: '600' }}>{fmt(o.totalAmount)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '12px', background: '#f5f5f5' }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select value={o.status} onChange={e => handleStatusChange(o._id, e.target.value)}
                      style={{ padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>
                      {['pending', 'processing', 'shipping', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9f9f9' }}>
              <tr>{['Tên', 'Email', 'Vai trò', 'Ngày tạo'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#555', fontWeight: '600' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>{u.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: u.role === 'admin' ? '#ffd70030' : '#e8f5e9', color: u.role === 'admin' ? '#b8860b' : '#27ae60' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#999' }}>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}