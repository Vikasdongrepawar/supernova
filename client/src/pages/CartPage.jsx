import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCart } from '../store/slices/cartSlice';
import { orderAPI } from '../services/api';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [placing, setPlacing] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) dispatch(fetchCart());
    else navigate('/login');
  }, [user, dispatch, navigate]);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    await dispatch(removeFromCart(productId));
    setRemovingId(null);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await orderAPI.create({
        shippingAddress: {
          street: '123 MG Road',
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          country: 'India',
          zipCode: '462001'
        }
      });
      setToast('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 1500);
    } catch (error) {
      setToast('Failed to place order. Please try again.');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setPlacing(false);
    }
  };

  const shipping = totalAmount > 999 ? 0 : 99;
  const tax = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + shipping + tax;

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; }
        .ct-remove { font-size:11px; color:#A32D2D; background:rgba(163,45,45,0.08); border:1px solid rgba(163,45,45,0.15); border-radius:6px; padding:5px 12px; cursor:pointer; font-family:'DM Sans',sans-serif; letter-spacing:0.04em; transition:all 0.2s; }
        .ct-remove:hover { background:rgba(163,45,45,0.15); border-color:rgba(163,45,45,0.3); }
        .ct-remove:disabled { opacity:0.4; cursor:not-allowed; }
        .ct-order-btn { width:100%; padding:14px; background:#c8a96e; color:#0a0a0a; border:none; border-radius:10px; font-size:13px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.2s; }
        .ct-order-btn:hover:not(:disabled) { background:#d4b87a; }
        .ct-order-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .ct-shop-btn { padding:10px 20px; background:transparent; color:#888780; border:1px solid #2a2a2a; border-radius:8px; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; letter-spacing:0.03em; }
        .ct-shop-btn:hover { border-color:#3a3a3a; color:#d3d1c7; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div>
            <h1 style={s.title}>Cart</h1>
            <p style={s.subtitle}>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button className="ct-shop-btn" onClick={() => navigate('/')}>
            ← Continue shopping
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={s.loader}>
          <div style={s.loaderDot('0s')} />
          <div style={s.loaderDot('0.2s')} />
          <div style={s.loaderDot('0.4s')} />
        </div>
      ) : items.length === 0 ? (
        /* Empty state */
        <div style={s.empty}>
          <div style={s.emptyIcon}>◻</div>
          <h2 style={s.emptyTitle}>Your cart is empty</h2>
          <p style={s.emptySub}>Add some products to get started</p>
          <button className="ct-shop-btn" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/')}>
            Browse products
          </button>
        </div>
      ) : (
        <div style={s.layout}>
          {/* Items */}
          <div style={s.itemsCol}>
            <div style={s.itemsGrid}>
              {items.map((item, i) => (
                <div
                  key={item.productId}
                  style={{ ...s.item, opacity: removingId === item.productId ? 0.4 : 1, transition: 'opacity 0.2s', animationDelay: `${i * 0.05}s` }}
                >
                  {/* Image */}
                  <div style={s.itemImg}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <span style={{ fontSize: '24px', color: '#1e1e1e' }}>◻</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={s.itemInfo}>
                    <p style={s.itemName}>{item.name}</p>
                    <div style={s.itemMeta}>
                      <span style={s.itemQtyBadge}>Qty: {item.quantity}</span>
                      <span style={s.itemUnit}>₹{item.price.toLocaleString()} each</span>
                    </div>
                  </div>

                  {/* Right */}
                  <div style={s.itemRight}>
                    <span style={s.itemTotal}>₹{(item.price * item.quantity).toLocaleString()}</span>
                    <button
                      className="ct-remove"
                      onClick={() => handleRemove(item.productId)}
                      disabled={removingId === item.productId}
                    >
                      {removingId === item.productId ? '...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={s.summaryCol}>
            <div style={s.summaryCard}>
              <h2 style={s.summaryTitle}>Order summary</h2>

              <div style={s.summaryRows}>
                <div style={s.summaryRow}>
                  <span style={s.summaryLabel}>Subtotal</span>
                  <span style={s.summaryValue}>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div style={s.summaryRow}>
                  <span style={s.summaryLabel}>Shipping</span>
                  <span style={shipping === 0 ? s.summaryFree : s.summaryValue}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div style={s.summaryRow}>
                  <span style={s.summaryLabel}>GST (18%)</span>
                  <span style={s.summaryValue}>₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div style={s.summaryDivider} />

              <div style={s.summaryTotal}>
                <span style={s.summaryTotalLabel}>Total</span>
                <span style={s.summaryTotalValue}>₹{grandTotal.toLocaleString()}</span>
              </div>

              {shipping === 0 && (
                <div style={s.freeShipBadge}>
                  Free shipping applied
                </div>
              )}

              <button
                className="ct-order-btn"
                style={{ marginTop: '1.5rem' }}
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'Placing order...' : 'Place order'}
              </button>

              <p style={s.secureTxt}>
                Secure checkout — your data is protected
              </p>
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
  header: {
    borderBottom: '1px solid #1a1a1a',
    padding: '0 2.5rem',
  },
  headerInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2rem 0',
  },
  title: {
    fontSize: '28px',
    fontWeight: '500',
    color: '#f0ede6',
    letterSpacing: '-0.01em',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#444441',
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '8px',
  },
  loaderDot: (delay) => ({
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
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    color: '#1e1e1e',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '400',
    color: '#444441',
    marginBottom: '8px',
  },
  emptySub: {
    fontSize: '13px',
    color: '#2a2a2a',
  },
  layout: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '2rem',
    alignItems: 'start',
  },
  itemsCol: {},
  itemsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    background: '#1a1a1a',
    border: '1px solid #1a1a1a',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    background: '#0d0d0d',
    animation: 'fadeIn 0.3s ease both',
  },
  itemImg: {
    width: '72px',
    height: '72px',
    borderRadius: '8px',
    background: '#141414',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#d3d1c7',
    marginBottom: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  itemQtyBadge: {
    fontSize: '11px',
    color: '#444441',
    background: '#141414',
    border: '1px solid #1e1e1e',
    borderRadius: '4px',
    padding: '2px 8px',
    letterSpacing: '0.04em',
  },
  itemUnit: {
    fontSize: '12px',
    color: '#333',
  },
  itemRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
    flexShrink: 0,
  },
  itemTotal: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#c8a96e',
    letterSpacing: '-0.01em',
  },
  summaryCol: {},
  summaryCard: {
    background: '#0d0d0d',
    border: '1px solid #1e1e1e',
    borderRadius: '12px',
    padding: '1.5rem',
    position: 'sticky',
    top: '80px',
  },
  summaryTitle: {
    fontSize: '13px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#444441',
    marginBottom: '1.25rem',
  },
  summaryRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#5f5e5a',
  },
  summaryValue: {
    fontSize: '13px',
    color: '#d3d1c7',
  },
  summaryFree: {
    fontSize: '12px',
    color: '#3B6D11',
    background: 'rgba(59,109,17,0.1)',
    border: '1px solid rgba(59,109,17,0.2)',
    borderRadius: '4px',
    padding: '2px 8px',
  },
  summaryDivider: {
    height: '1px',
    background: '#1e1e1e',
    margin: '1.25rem 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#f0ede6',
  },
  summaryTotalValue: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#c8a96e',
    letterSpacing: '-0.02em',
  },
  freeShipBadge: {
    marginTop: '1rem',
    fontSize: '11px',
    color: '#3B6D11',
    background: 'rgba(59,109,17,0.08)',
    border: '1px solid rgba(59,109,17,0.15)',
    borderRadius: '6px',
    padding: '6px 12px',
    textAlign: 'center',
    letterSpacing: '0.04em',
  },
  secureTxt: {
    marginTop: '1rem',
    fontSize: '11px',
    color: '#2a2a2a',
    textAlign: 'center',
    letterSpacing: '0.03em',
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

export default CartPage;