import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import productService from '../services/productService';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 8;

export default function HomePage({ searchQuery, category, sort }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, sort]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      toast.error('Không thể tải sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products
    .filter(p => {
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = !category || category === 'all' || p.category === category;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sort === 'asc') return a.price - b.price;
      if (sort === 'desc') return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      {/* Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #e74c3c, #f39c12, #27ae60)',
        padding: '60px 0', textAlign: 'center', color: 'white'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>
            ThQuanShop - E-Commerce với MongoDB
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            16 sản phẩm • Pagination • Hủy đơn • Đánh giá • Admin đầy đủ
          </p>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '40px 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '400px' }}>
        <div className="container">
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
            Sản phẩm nổi bật {!loading && `(${filtered.length} sản phẩm)`}
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'white', padding: '60px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : paged.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'white', padding: '60px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>😕</div>
              <p>Không tìm thấy sản phẩm</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {paged.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </>
  );
}