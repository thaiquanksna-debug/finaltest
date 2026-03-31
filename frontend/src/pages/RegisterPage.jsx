import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Mật khẩu không khớp!');
    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      toast.success('Đăng ký thành công!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '28px', color: '#333', fontSize: '24px' }}>📝 Đăng Ký</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Họ tên', name: 'name', type: 'text', placeholder: 'Nguyễn Văn A' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
            { label: 'Mật khẩu', name: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'Xác nhận mật khẩu', name: 'confirm', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555' }}>{field.label}</label>
              <input
                type={field.type} name={field.name} value={form[field.name]}
                onChange={handleChange} required placeholder={field.placeholder}
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{ padding: '12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#e74c3c', fontWeight: '600' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}