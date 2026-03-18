import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; }
        .ln-input { width:100%; background:#111; border:1px solid #2a2a2a; border-radius:8px; padding:12px 14px; font-size:14px; color:#e8e6e1; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.2s; }
        .ln-input:focus { border-color:#c8a96e; }
        .ln-input::placeholder { color:#333; }
        .ln-btn { width:100%; padding:13px; background:#c8a96e; color:#0a0a0a; border:none; border-radius:8px; font-size:13px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.2s; }
        .ln-btn:hover:not(:disabled) { background:#d4b87a; }
        .ln-btn:disabled { opacity:0.4; cursor:not-allowed; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Background grid */}
      <div style={s.grid} />

      {/* Card */}
      <div style={s.card}>

        {/* Logo */}
        <div style={s.logoWrap}>
          <span style={s.logo}>Super<span style={s.logoAccent}>nova</span></span>
        </div>

        {/* Heading */}
        <div style={s.heading}>
          <h1 style={s.title}>Welcome back</h1>
          <p style={s.subtitle}>Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div style={s.error}>
            <span style={s.errorDot} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="ln-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={s.field}>
            <div style={s.labelRow}>
              <label style={s.label}>Password</label>
            </div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="ln-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="ln-btn" style={{ marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>or</span>
          <div style={s.dividerLine} />
        </div>

        {/* Register link */}
        <p style={s.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={s.link}>Create one</Link>
        </p>
      </div>

      {/* Bottom tag */}
      <p style={s.bottomTag}>SUPERNOVA — Modern Commerce</p>
    </div>
  );
};

const s = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
    backgroundSize: '48px 48px',
    opacity: 0.3,
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#0d0d0d',
    border: '1px solid #1e1e1e',
    borderRadius: '16px',
    padding: '2.5rem',
    position: 'relative',
    zIndex: 1,
    animation: 'fadeIn 0.4s ease',
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#f0ede6',
    textTransform: 'uppercase',
  },
  logoAccent: {
    color: '#c8a96e',
    fontStyle: 'italic',
    fontWeight: '300',
  },
  heading: {
    marginBottom: '1.75rem',
  },
  title: {
    fontSize: '24px',
    fontWeight: '500',
    color: '#f0ede6',
    letterSpacing: '-0.01em',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#444441',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(163,45,45,0.08)',
    border: '1px solid rgba(163,45,45,0.2)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#f09595',
    marginBottom: '1.25rem',
  },
  errorDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#E24B4A',
    flexShrink: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '12px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#444441',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '1.5rem 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#1e1e1e',
  },
  dividerText: {
    fontSize: '11px',
    color: '#2a2a2a',
    letterSpacing: '0.06em',
  },
  footer: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#444441',
  },
  link: {
    color: '#c8a96e',
    textDecoration: 'none',
    fontWeight: '500',
  },
  bottomTag: {
    marginTop: '2rem',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#1e1e1e',
    position: 'relative',
    zIndex: 1,
  },
};

export default LoginPage;
