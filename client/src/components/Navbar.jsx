import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        .snv-nav { display:flex; align-items:center; justify-content:space-between; padding:0 2.5rem; height:64px; background:#0a0a0a; border-bottom:1px solid #1e1e1e; position:sticky; top:0; z-index:100; font-family:'DM Sans','Helvetica Neue',sans-serif; }
        .snv-logo { font-size:16px; font-weight:700; letter-spacing:0.1em; color:#f0ede6; text-transform:uppercase; text-decoration:none; }
        .snv-logo span { color:#c8a96e; font-style:italic; font-weight:300; }
        .snv-links { display:flex; align-items:center; gap:1.75rem; }
        .snv-link { font-size:13px; color:#444441; text-decoration:none; letter-spacing:0.03em; transition:color 0.2s; }
        .snv-link:hover { color:#d3d1c7; }
        .snv-user { font-size:13px; color:#5f5e5a; letter-spacing:0.02em; }
        .snv-cart { display:flex; align-items:center; gap:6px; font-size:13px; color:#f0ede6; background:#141414; border:1px solid #2a2a2a; border-radius:8px; padding:6px 14px; cursor:pointer; text-decoration:none; transition:border-color 0.2s; position:relative; }
        .snv-cart:hover { border-color:#3a3a3a; }
        .snv-badge { position:absolute; top:-6px; right:-6px; background:#c8a96e; color:#0a0a0a; font-size:9px; font-weight:700; border-radius:10px; min-width:16px; height:16px; display:flex; align-items:center; justify-content:center; padding:0 4px; }
        .snv-btn-outline { font-size:13px; color:#888780; background:transparent; border:1px solid #2a2a2a; border-radius:8px; padding:6px 14px; cursor:pointer; text-decoration:none; transition:all 0.2s; letter-spacing:0.03em; }
        .snv-btn-outline:hover { border-color:#3a3a3a; color:#d3d1c7; }
        .snv-btn-primary { font-size:13px; color:#0a0a0a; background:#c8a96e; border:none; border-radius:8px; padding:7px 16px; cursor:pointer; text-decoration:none; font-weight:600; letter-spacing:0.04em; transition:background 0.2s; }
        .snv-btn-primary:hover { background:#d4b87a; }
        .snv-btn-danger { font-size:12px; color:#A32D2D; background:rgba(163,45,45,0.08); border:1px solid rgba(163,45,45,0.2); border-radius:8px; padding:6px 14px; cursor:pointer; letter-spacing:0.03em; transition:all 0.2s; }
        .snv-btn-danger:hover { background:rgba(163,45,45,0.15); border-color:rgba(163,45,45,0.35); }
        .snv-divider { width:1px; height:18px; background:#1e1e1e; }
      `}</style>

      <nav className="snv-nav">
        {/* Logo */}
        <Link to="/" className="snv-logo">
          Super<span>nova</span>
        </Link>

        {/* Links */}
        <div className="snv-links">
          <Link to="/" className="snv-link">Shop</Link>

          {user ? (
            <>
              <div className="snv-divider" />

              {/* Cart */}
              <Link to="/cart" className="snv-cart">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                </svg>
                Cart
                {items.length > 0 && (
                  <span className="snv-badge">{items.length}</span>
                )}
              </Link>

              {/* Orders */}
              <Link to="/orders" className="snv-link">Orders</Link>

              {user?.role === 'seller' && (
                <Link to="/seller" className="snv-link">Dashboard</Link>
              )}

              <div className="snv-divider" />

              {/* User */}
              <span className="snv-user">
                {user.name?.split(' ')[0]}
              </span>

              {/* Logout */}
              <button onClick={handleLogout} className="snv-btn-danger">
                Sign out
              </button>
            </>
          ) : (
            <>
              <div className="snv-divider" />
              <Link to="/login" className="snv-btn-outline">Sign in</Link>
              <Link to="/register" className="snv-btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
