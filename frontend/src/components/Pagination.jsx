// src/components/Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '24px 0' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 14px', border: '1px solid #ddd', borderRadius: '6px',
          background: currentPage === 1 ? '#f5f5f5' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
        }}
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 14px', border: '1px solid #ddd', borderRadius: '6px',
            background: page === currentPage ? '#e74c3c' : 'white',
            color: page === currentPage ? 'white' : '#333',
            fontWeight: page === currentPage ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 14px', border: '1px solid #ddd', borderRadius: '6px',
          background: currentPage === totalPages ? '#f5f5f5' : 'white',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        ›
      </button>
    </div>
  );
}