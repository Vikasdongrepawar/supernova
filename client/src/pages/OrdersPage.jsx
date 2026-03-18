import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { orderAPI } from '../services/api';

const STATUS = {
  pending:   { label: 'Pending',   color: '#BA7517', bg: 'rgba(186,117,23,0.08)',   border: 'rgba(186,117,23,0.2)'  },
  confirmed: { label: 'Confirmed', color: '#185FA5', bg: 'rgba(24,95,165,0.08)',    border: 'rgba(24,95,165,0.2)'  },
  shipped:   { label: 'Shipped',   color: '#534AB7', bg: 'rgba(83,74,183,0.08)',    border: 'rgba(83,74,183,0.2)'  },
  delivered: { label: 'Delivered', color: '#3B6D11', bg: 'rgba(59,109,17,0.08)',    border: 'rgba(59,109,17,0.2)'  },
  cancelled: { label: 'Cancelled', color: '#A32D2D', bg: 'rgba(163,45,45,0.08)',    border: 'rgba(163,45,45,0.2)'  },
};

const STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  const getStatusStep = (status) => STEPS.indexOf(status);

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; }
        .ord-card { background:#0d0d0d; border:1px solid #1e1e1e; border-radius:12px; overflow:hidden; transition:border-color 0.2s; cursor:pointer; }
        .ord-card:hover { border-color:#2a2a2a; }
        .ord-shop-btn { padding:10px 20px; background:transparent; color:#888780; border:1px solid #2a2a2a; border-radius:8px; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; letter-spacing:0.03em; }
        .ord-shop-btn:hover { border-color:#3a3a3a; color:#d3d1c7; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div>
            <h1 style={s.title}>My Orders</h1>
            <p style={s.subtitle}>{orders.length} {orders.length === 1 ? 'order' : 'orders'} total</p>
          </div>
          <button className="ord-shop-btn" onClick={() => navigate('/')}>
            ← Back to shop
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={s.loader}>
          <div style={s.dot('0s')} />
          <div style={s.dot('0.2s')} />
          <div style={s.dot('0.4s')} />
        </div>
      ) : orders.length === 0 ? (
        /* Empty */
        <div style={s.empty}>
          <div style={s.emptyIcon}>◻</div>
          <h2 style={s.emptyTitle}>No orders yet</h2>
          <p style={s.emptySub}>Your order history will appear here</p>
          <button className="ord-shop-btn" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/')}>
            Start shopping
          </button>
        </div>
      ) : (
        <div style={s.main}>
          {orders.map((order, i) => {
            const st = STATUS[order.status] || STATUS.pending;
            const isExpanded = expanded === order._id;
            const stepIdx = getStatusStep(order.status);

            return (
              <div
                key={order._id}
                className="ord-card"
                style={{ animation: `fadeIn 0.3s ease both`, animationDelay: `${i * 0.06}s` }}
                onClick={() => toggleExpand(order._id)}
              >
                {/* Card header */}
                <div style={s.cardHead}>
                  <div style={s.cardLeft}>
                    <span style={s.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                    <span style={s.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={s.cardRight}>
                    <span style={{ ...s.statusBadge, color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      {st.label}
                    </span>
                    <span style={s.totalAmt}>₹{order.totalAmount.toLocaleString()}</span>
                    <span style={{ ...s.chevron, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                  </div>
                </div>

                {/* Items preview (collapsed) */}
                {!isExpanded && (
                  <div style={s.preview}>
                    {order.items.slice(0, 3).map(item => (
                      <span key={item._id} style={s.previewItem}>{item.name}</span>
                    ))}
                    {order.items.length > 3 && (
                      <span style={s.previewMore}>+{order.items.length - 3} more</span>
                    )}
                  </div>
                )}

                {/* Expanded content */}
                {isExpanded && (
                  <div style={s.expanded}>

                    {/* Progress bar (only for non-cancelled) */}
                    {order.status !== 'cancelled' && (
                      <div style={s.progressWrap}>
                        {STEPS.map((step, idx) => (
                          <div key={step} style={s.progressStep}>
                            <div style={{ ...s.progressDot, background: idx <= stepIdx ? '#c8a96e' : '#1e1e1e', border: idx <= stepIdx ? 'none' : '1px solid #2a2a2a' }} />
                            <span style={{ ...s.progressLabel, color: idx <= stepIdx ? '#888780' : '#2a2a2a' }}>
                              {step.charAt(0).toUpperCase() + step.slice(1)}
                            </span>
                            {idx < STEPS.length - 1 && (
                              <div style={{ ...s.progressLine, background: idx < stepIdx ? '#c8a96e' : '#1e1e1e' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={s.divider} />

                    {/* Items */}
                    <div style={s.itemsList}>
                      {order.items.map((item) => (
                        <div key={item._id} style={s.itemRow}>
                          <div style={s.itemDot} />
                          <span style={s.itemName}>{item.name}</span>
                          <span style={s.itemQty}>× {item.quantity}</span>
                          <span style={s.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div style={s.divider} />

                    {/* Address + Total */}
                    <div style={s.cardFooter}>
                      <div style={s.addressWrap}>
                        <span style={s.addrLabel}>Ship to</span>
                        <span style={s.addrText}>
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </span>
                      </div>
                      <div style={s.totalWrap}>
                        <span style={s.totalLabel}>Order total</span>
                        <span style={s.totalValue}>₹{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
    maxWidth: '800px',
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
    textAlign: 'center',
  },
  emptyIcon: { fontSize: '48px', color: '#1e1e1e', marginBottom: '1rem' },
  emptyTitle: { fontSize: '20px', fontWeight: '400', color: '#444441', marginBottom: '8px' },
  emptySub: { fontSize: '13px', color: '#2a2a2a' },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  orderId: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#d3d1c7',
    fontFamily: 'monospace',
    letterSpacing: '0.04em',
  },
  orderDate: {
    fontSize: '12px',
    color: '#444441',
  },
  cardRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.06em',
    borderRadius: '6px',
    padding: '4px 10px',
    textTransform: 'uppercase',
  },
  totalAmt: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#c8a96e',
    letterSpacing: '-0.01em',
  },
  chevron: {
    fontSize: '14px',
    color: '#444441',
    transition: 'transform 0.2s',
    userSelect: 'none',
  },
  preview: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    padding: '0 1.5rem 1.25rem',
  },
  previewItem: {
    fontSize: '11px',
    color: '#444441',
    background: '#141414',
    border: '1px solid #1e1e1e',
    borderRadius: '4px',
    padding: '3px 8px',
  },
  previewMore: {
    fontSize: '11px',
    color: '#333',
    padding: '3px 8px',
  },
  expanded: {
    borderTop: '1px solid #1a1a1a',
    padding: '1.5rem',
  },
  progressWrap: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0',
    marginBottom: '1.5rem',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  progressDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginBottom: '6px',
    zIndex: 1,
    transition: 'background 0.3s',
  },
  progressLabel: {
    fontSize: '10px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'color 0.3s',
  },
  progressLine: {
    position: 'absolute',
    top: '4px',
    left: '50%',
    width: '100%',
    height: '2px',
    transition: 'background 0.3s',
  },
  divider: {
    height: '1px',
    background: '#1a1a1a',
    margin: '1.25rem 0',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  itemDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#2a2a2a',
    flexShrink: 0,
  },
  itemName: {
    flex: 1,
    fontSize: '13px',
    color: '#d3d1c7',
  },
  itemQty: {
    fontSize: '12px',
    color: '#444441',
  },
  itemPrice: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#c8a96e',
    minWidth: '80px',
    textAlign: 'right',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  addressWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  addrLabel: {
    fontSize: '10px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#333',
  },
  addrText: {
    fontSize: '12px',
    color: '#5f5e5a',
    maxWidth: '280px',
  },
  totalWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  totalLabel: {
    fontSize: '10px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#333',
  },
  totalValue: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#c8a96e',
    letterSpacing: '-0.02em',
  },
};

export default OrdersPage;