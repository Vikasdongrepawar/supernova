import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const CATEGORIES = ['all', 'shoes', 'clothing', 'electronics', 'accessories'];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    setAddingId(productId);
    await dispatch(addToCart({ productId, quantity: 1 }));
    setAddingId(null);
    setToast('Added to cart');
    setTimeout(() => setToast(null), 2500);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category?.toLowerCase() === activeCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: "'DM Sans', sans-serif", color: '#e8e6e1' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes slideUp { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
        .hp-search:focus { border-color:#c8a96e !important; }
        .hp-search::placeholder { color:#333; }
        .hp-card:hover { background:#111111 !important; }
      `}</style>

      <section style={{ padding: '4rem 2.5rem 2.5rem', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ display: 'inline-block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '4px', padding: '4px 10px', marginBottom: '1.25rem' }}>New arrivals</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '300', lineHeight: '1.1', letterSpacing: '-0.02em', color: '#f0ede6', margin: '0 0 0.75rem', maxWidth: '600px' }}>
          Shop the <span style={{ fontStyle: 'italic', color: '#c8a96e' }}>future</span>,<br />delivered today.
        </h1>
        <p style={{ fontSize: '14px', color: '#5f5e5a', maxWidth: '380px', lineHeight: '1.6' }}>Curated products from verified sellers. Fast shipping, zero hassle.</p>
      </section>

      <div style={{ borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ padding: '1.25rem 2.5rem', borderBottom: '1px solid #111' }}>
          <div style={{ maxWidth: '480px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#444441', pointerEvents: 'none' }} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" className="hp-search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 36px 10px 38px', fontSize: '13px', color: '#e8e6e1', fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s' }} />
            {searchQuery && <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444441', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: 0 }}>×</button>}
          </div>
          {searchQuery && <p style={{ fontSize: '12px', color: '#444441', marginTop: '8px' }}>{filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "<span style={{ color: '#c8a96e' }}>{searchQuery}</span>"</p>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.5rem', overflowX: 'auto' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#333', marginRight: '0.25rem', whiteSpace: 'nowrap' }}>Filter</span>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ fontSize: '12px', padding: '5px 14px', borderRadius: '20px', border: activeCategory === cat ? '1px solid #c8a96e' : '1px solid #1e1e1e', background: activeCategory === cat ? 'rgba(200,169,110,0.1)' : 'transparent', color: activeCategory === cat ? '#c8a96e' : '#5f5e5a', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <main style={{ padding: '2.5rem' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '8px' }}>
            {['0s', '0.2s', '0.4s'].map(d => <div key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8a96e', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: d }} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <p style={{ fontSize: '18px', color: '#444441', marginBottom: '8px' }}>{searchQuery ? `No results for "${searchQuery}"` : 'Nothing here yet'}</p>
            {searchQuery && <button onClick={() => setSearchQuery('')} style={{ fontSize: '13px', color: '#c8a96e', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear search</button>}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444441' }}>Products</span>
              <span style={{ fontSize: '12px', color: '#2a2a2a' }}>{filteredProducts.length} items</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: '#1a1a1a', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
              {filteredProducts.map((product) => (
                <div key={product._id} className="hp-card" onClick={() => navigate(`/products/${product._id}`)} style={{ background: '#0d0d0d', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer', transition: 'background 0.2s' }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px' }} onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#2a2a2a' }}>◻</div>
                  )}
                  <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#444441' }}>{product.category}</span>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#d3d1c7', lineHeight: '1.3', margin: 0 }}>{product.name}</p>
                  <p style={{ fontSize: '12px', color: '#444441', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: 0 }}>{product.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #1a1a1a' }}>
                    <span style={{ fontSize: '18px', fontWeight: '600', color: '#c8a96e' }}>₹{product.price.toLocaleString()}</span>
                    <span style={{ fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: product.stock > 0 ? '#3B6D11' : '#A32D2D', background: product.stock > 0 ? 'rgba(59,109,17,0.1)' : 'rgba(163,45,45,0.1)', border: product.stock > 0 ? '1px solid rgba(59,109,17,0.2)' : '1px solid rgba(163,45,45,0.2)', borderRadius: '4px', padding: '3px 8px' }}>
                      {product.stock > 0 ? `${product.stock} left` : 'sold out'}
                    </span>
                  </div>
                  <button onClick={(e) => handleAddToCart(product._id, e)} disabled={addingId === product._id || product.stock === 0} style={{ width: '100%', padding: '10px', background: addingId === product._id || product.stock === 0 ? '#1a1a1a' : '#c8a96e', color: addingId === product._id || product.stock === 0 ? '#444' : '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', transition: 'background 0.2s', fontFamily: "'DM Sans', sans-serif" }}>
                    {addingId === product._id ? 'Adding...' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '12px 20px', fontSize: '13px', color: '#d3d1c7', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 999, animation: 'slideUp 0.3s ease' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B6D11', flexShrink: 0 }} />
          {toast}
        </div>
      )}
    </div>
  );
};

export default HomePage;