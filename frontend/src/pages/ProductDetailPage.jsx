// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';
import { apiCall } from '../services/api';
import toast from 'react-hot-toast';

const fmt = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getById(id);
      setProduct(data);
    } catch {
      toast.error('Không tìm thấy sản phẩm!');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await apiCall(`/reviews/product/${id}`);
      setReviews(data.reviews || []);
    } catch {}
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ!`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/reviews', {
        method: 'POST',
        body: JSON.stringify({ product: id, ...reviewForm }),
      });
      toast.success('Đánh giá thành công!');
      setReviewForm({ rating: 5, comment: '' });
      loadReviews();
    } catch (err) {
      toast.error(err.message || 'Đăng nhập để đánh giá!');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>⏳ Đang tải...</div>;
  if (!product) return null;

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
        <div>
          <img src={product.image} alt={product.name}
            style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '400px' }}
            onError={e => e.target.src = 'https://via.placeholder.com/400?text=No+Image'} />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>{product.name}</h1>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#e74c3c' }}>{fmt(discountedPrice)}</span>
            {product.discount > 0 && (
              <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through', marginLeft: '12px' }}>{fmt(product.price)}</span>
            )}
          </div>
          <p style={{ color: '#666', lineHeight: 1.7, marginBottom: '20px' }}>{product.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ color: '#555' }}>Số lượng:</span>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{ width: '32px', height: '32px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: 'white' }}>-</button>
            <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              style={{ width: '32px', height: '32px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: 'white' }}>+</button>
            <span style={{ color: product.stock > 0 ? '#27ae60' : '#e74c3c', fontSize: '13px' }}>
              {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </span>
          </div>
          <button onClick={handleAddToCart} disabled={product.stock === 0}
            style={{ width: '100%', padding: '14px', background: product.stock === 0 ? '#ccc' : '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}>
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>⭐ Đánh giá ({reviews.length})</h3>

        <form onSubmit={handleReview} style={{ marginBottom: '24px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '12px', color: '#555' }}>Viết đánh giá</h4>
          <select value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '12px' }}>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'★'.repeat(r)} {r} sao</option>)}
          </select>
          <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
            placeholder="Nhận xét của bạn..." rows={3} required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px' }} />
          <button type="submit"
            style={{ padding: '10px 24px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Gửi đánh giá
          </button>
        </form>

        {reviews.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>Chưa có đánh giá nào</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map(r => (
              <div key={r._id} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>{r.user?.name || 'Ẩn danh'}</span>
                  <span style={{ color: '#f39c12' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p style={{ color: '#555', fontSize: '14px' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}