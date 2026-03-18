import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { productAPI } from '../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await productAPI.getById(id);
      setProduct(res.data);
    } catch (error) {
      console.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    await dispatch(addToCart({ productId: id, quantity }));
    setAdding(false);
    setToast('Added to cart');
    setTimeout(() => setToast(null), 2500);
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    await dispatch(addToCart({ productId: id, quantity }));
    setAdding(false);
    navigate('/cart');
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'DM Sans',sans-serif; background:#0a0a0a; }
        .pd-back { font-size:13px; color:#444441; background:transparent; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; display:flex; align-items:center; gap:6px; padding:0; transition:color 0.2s; letter-spacing:0.03em; }
        .pd-back:hover { color:#d3d1c7; }
        .pd-qty-btn { width:36px; height:36px; background:#141414; border:1px solid #2a2a2a; border-radius:8px; color:#d3d1c7; font-size:18px; cursor:pointer; font-family:'DM Sans',sans-serif; display:flex; align-items:center; justify-content:center; transition:border-color 0.2s; line-height:1; }
        .pd-qty-btn:hover:not(:disabled) { border-color:#3a3a3a; }
        .pd-qty-btn:disabled { opacity:0.3; cursor:not-allowed; }
        .pd-cart-btn { flex:1; padding:14px; background:#c8a96e; color:#0a0a0a; border:none; border-radius:10px; font-size:13px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.2s; }
        .pd-cart-btn:hover:not(:disabled) { background:#d4b87a; }
        .pd-cart-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .pd-buy-btn { flex:1; padding:14px; background:transparent; color:#d3d1c7; border:1px solid #2a2a2a; border-radius:10px; font-size:13px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
        .pd-buy-btn:hover:not(:disabled) { border-color:#3a3a3a; color:#f0ede6; }
        .pd-buy-btn:disabled { opacity:0.4; cursor:not-allowed; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>

      {/* Back button */}
      <div style={s.topBar}>
        <button className="pd-back" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={s.loader}>
          <div style={s.dot('0s')} />
          <div style={s.dot('0.2s')} />
          <div style={s.dot('0.4s')} />
        </div>
      ) : !product ? (
        <div style={s.empty}>
          <h2 style={s.emptyTitle}>Product not found</h2>
          <button className="pd-back" onClick={() => navigate('/')}>Go back to shop</button>
        </div>
      ) : (
        <div style={s.layout}>

          {/* Left — Image */}
          <div style={s.imageCol}>
            <div style={s.imageWrap}>
              {product.images?.[0] && !imgError ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={s.image}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div style={s.imagePlaceholder}>◻</div>
              )}
            </div>

            {/* Thumbnail row */}
            {product.images?.length > 1 && (
              <div style={s.thumbRow}>
                {product.images.map((img, i) => (
                  <div key={i} style={s.thumb}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div style={s.infoCol}>

            {/* Category + status */}
            <div style={s.tagRow}>
              <span style={s.categoryTag}>{product.category}</span>
              {product.stock > 0 ? (
                <span style={s.inStockTag}>In stock</span>
              ) : (
                <span style={s.outStockTag}>Sold out</span>
              )}
            </div>

            {/* Name */}
            <h1 style={s.name}>{product.name}</h1>

            {/* Price */}
            <div style={s.priceRow}>
              <span style={s.price}>₹{product.price.toLocaleString()}</span>
              <span style={s.perUnit}>per unit</span>
            </div>

            {/* Divider */}
            <div style={s.divider} />

            {/* Description */}
            <p style={s.description}>{product.description}</p>

            <div style={s.divider} />

            {/* Stock info */}
            <div style={s.metaRow}>
              <div style={s.metaItem}>
                <span style={s.metaLabel}>Available stock</span>
                <span style={s.metaValue}>{product.stock} units</span>
              </div>
              <div style={s.metaItem}>
                <span style={s.metaLabel}>Category</span>
                <span style={s.metaValue}>{product.category}</span>
              </div>
              <div style={s.metaItem}>
                <span style={s.metaLabel}>Seller</span>
                <span style={s.metaValue}>{product.seller?.slice(-6).toUpperCase() || 'Verified'}</span>
              </div>
            </div>

            <div style={s.divider} />

            {/* Quantity selector */}
            {product.stock > 0 && (
              <div style={s.qtyRow}>
                <span style={s.qtyLabel}>Quantity</span>
                <div style={s.qtyControls}>
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span style={s.qtyNum}>{quantity}</span>
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span style={s.qtyTotal}>
                  Total: <strong style={{ color: '#c8a96e' }}>₹{(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div style={s.actions}>
              {product.stock > 0 ? (
                <>
                  <button className="pd-cart-btn" onClick={handleAddToCart} disabled={adding}>
                    {adding ? 'Adding...' : 'Add to cart'}
                  </button>
                  <button className="pd-buy-btn" onClick={handleBuyNow} disabled={adding}>
                    Buy now
                  </button>
                </>
              ) : (
                <button className="pd-cart-btn" disabled style={{ opacity: 0.4 }}>
                  Sold out
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div style={s.badges}>
              {['Free shipping over ₹999', 'Easy returns', 'Secure checkout'].map(b => (
                <div key={b} style={s.badge}>
                  <span style={s.badgeDot} />
                  <span style={s.badgeText}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={s.toast}>
          <span style={s.toastDot} />
          {toast}
        </div>
      )}
    </div>
  );
};

const s = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    color: '#e8e6e1',
  },
  topBar: {
    padding: '1.5rem 2.5rem',
    borderBottom: '1px solid #1a1a1a',
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '8px',
  },
  dot: (delay) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#c8a96e',
    animation: 'pulse 1.2s ease-in-out infinite',
    animationDelay: delay,
  }),
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '400',
    color: '#444441',
  },
  layout: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 2.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'start',
    animation: 'fadeIn 0.4s ease',
  },
  imageCol: {},
  imageWrap: {
    width: '100%',
    aspectRatio: '1',
    background: '#0d0d0d',
    border: '1px solid #1e1e1e',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePlaceholder: {
    fontSize: '64px',
    color: '#1e1e1e',
  },
  thumbRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  thumb: {
    width: '64px',
    height: '64px',
    borderRadius: '8px',
    border: '1px solid #1e1e1e',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  tagRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryTag: {
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#888780',
    background: '#141414',
    border: '1px solid #1e1e1e',
    borderRadius: '4px',
    padding: '3px 10px',
  },
  inStockTag: {
    fontSize: '11px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#3B6D11',
    background: 'rgba(59,109,17,0.1)',
    border: '1px solid rgba(59,109,17,0.2)',
    borderRadius: '4px',
    padding: '3px 10px',
  },
  outStockTag: {
    fontSize: '11px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#A32D2D',
    background: 'rgba(163,45,45,0.1)',
    border: '1px solid rgba(163,45,45,0.2)',
    borderRadius: '4px',
    padding: '3px 10px',
  },
  name: {
    fontSize: '32px',
    fontWeight: '400',
    color: '#f0ede6',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  price: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#c8a96e',
    letterSpacing: '-0.02em',
  },
  perUnit: {
    fontSize: '13px',
    color: '#333',
  },
  divider: {
    height: '1px',
    background: '#1a1a1a',
  },
  description: {
    fontSize: '14px',
    color: '#5f5e5a',
    lineHeight: '1.7',
  },
  metaRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metaLabel: {
    fontSize: '10px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#333',
  },
  metaValue: {
    fontSize: '13px',
    color: '#d3d1c7',
    fontWeight: '500',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  qtyLabel: {
    fontSize: '12px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#444441',
    minWidth: '60px',
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  qtyNum: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#f0ede6',
    minWidth: '28px',
    textAlign: 'center',
  },
  qtyTotal: {
    fontSize: '13px',
    color: '#5f5e5a',
    marginLeft: 'auto',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  badges: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '1rem',
    background: '#0d0d0d',
    border: '1px solid #1a1a1a',
    borderRadius: '10px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badgeDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#c8a96e',
    flexShrink: 0,
  },
  badgeText: {
    fontSize: '12px',
    color: '#5f5e5a',
  },
  toast: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '13px',
    color: '#d3d1c7',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 999,
    animation: 'slideUp 0.3s ease',
  },
  toastDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#3B6D11',
    flexShrink: 0,
  },
};

export default ProductDetailPage;
