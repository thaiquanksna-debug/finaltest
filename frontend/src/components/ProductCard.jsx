// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`Đã thêm ${product.name} vào giỏ!`);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'white', borderRadius: '12px', overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
      >
        <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = 'https://via.placeholder.com/300x225?text=No+Image'; }}
          />
          {product.discount > 0 && (
            <span style={{
              position: 'absolute', top: '10px', left: '10px',
              background: '#e74c3c', color: 'white', padding: '2px 8px',
              borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
            }}>
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span style={{
              position: 'absolute', top: '10px', right: '10px',
              background: '#27ae60', color: 'white', padding: '2px 8px',
              borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
            }}>
              MỚI
            </span>
          )}
        </div>

        <div style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>

          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#e74c3c' }}>
              {formatPrice(discountedPrice)}
            </span>
            {product.discount > 0 && (
              <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through', marginLeft: '8px' }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ color: '#f39c12', fontSize: '13px' }}>
              {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}
              <span style={{ color: '#999', marginLeft: '4px' }}>({product.reviewCount || 0})</span>
            </div>
            <span style={{ fontSize: '12px', color: product.stock > 0 ? '#27ae60' : '#e74c3c' }}>
              {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              width: '100%', padding: '10px', border: 'none', borderRadius: '8px',
              background: product.stock === 0 ? '#ccc' : '#e74c3c',
              color: 'white', fontWeight: '600', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              fontSize: '13px', transition: 'background 0.2s'
            }}
          >
            {product.stock === 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </Link>
  );
}