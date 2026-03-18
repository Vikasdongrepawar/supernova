import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { productAPI } from '../services/api';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'shoes', stock: '', images: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && user.role !== 'seller' && user.role !== 'admin') {
      navigate('/');
      return;
    }
    if (user) {
      fetchProducts();
    }
  }, [user, token]);

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAll();
      const myProducts = res.data.products;
      setProducts(myProducts);
    } catch {
      showToast('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: 'shoes', stock: '', images: '' });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images?.[0] || ''
    });
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        images: form.images ? [form.images] : []
      };
      if (editingProduct) {
        await productAPI.update(editingProduct._id, data);
        showToast('Product updated successfully!');
      } else {
        await productAPI.create(data);
        showToast('Product created successfully!');
      }
      resetForm();
      fetchProducts();
    } catch {
      showToast('Something went wrong', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setDeletingId(id);
    try {
      await productAPI.delete(id);
      showToast('Product deleted');
      fetchProducts();
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  // Show loading while user is being fetched
  if (token && !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '8px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8a96e', animation: 'pulse 1.2s ease-in-out infinite' }} />
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8a96e', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0.2s' }} />
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8a96e', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0.4s' }} />
        <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .sd-input { width:100%; background:#111; border:1px solid #2a2a2a; border-radius:8px; padding:10px 14px; font-size:13px; color:#e8e6e1; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.2s; }
        .sd-input:focus { border-color:#c8a96e; }
        .sd-input::placeholder { color:#333; }
        .sd-select { width:100%; background:#111; border:1px solid #2a2a2a; border-radius:8px; padding:10px 14px; font-size:13px; color:#e8e6e1; font-family:'DM Sans',sans-serif; outline:none; appearance:none; cursor:pointer; }
        .sd-select:focus { border-color:#c8a96e; }
        .sd-select option { background:#111; }
        .sd-textarea { width:100%; background:#111; border:1px solid #2a2a2a; border-radius:8px; padding:10px 14px; font-size:13px; color:#e8e6e1; font-family:'DM Sans',sans-serif; outline:none; resize:vertical; min-height:80px; transition:border-color 0.2s; }
        .sd-textarea:focus { border-color:#c8a96e; }
        .sd-textarea::placeholder { color:#333; }
        .sd-primary { padding:10px 20px; background:#c8a96e; color:#0a0a0a; border:none; border-radius:8px; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.2s; }
        .sd-primary:hover { background:#d4b87a; }
        .sd-outline { padding:10px 20px; background:transparent; color:#888780; border:1px solid #2a2a2a; border-radius:8px; font-size:12px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; letter-spacing:0.03em; }
        .sd-outline:hover { border-color:#3a3a3a; color:#d3d1c7; }
        .sd-edit { padding:6px 14px; background:rgba(24,95,165,0.08); color:#85B7EB; border:1px solid rgba(24,95,165,0.2); border-radius:6px; font-size:11px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; letter-spacing:0.04em; }
        .sd-edit:hover { background:rgba(24,95,165,0.15); }
        .sd-delete { padding:6px 14px; background:rgba(163,45,45,0.08); color:#f09595; border:1px solid rgba(163,45,45,0.2); border-radius:6px; font-size:11px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; letter-spacing:0.04em; }
        .sd-delete:hover { background:rgba(163,45,45,0.15); }
        .sd-delete:disabled { opacity:0.4; cursor:not-allowed; }
        .sd-row:hover { background:#111 !important; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>

      <div style={s.header}>
        <div style={s.headerInner}>
          <div>
            <h1 style={s.title}>Seller Dashboard</h1>
            <p style={s.subtitle}>Manage your products and inventory</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="sd-outline" onClick={() => navigate('/')}>← Back to shop</button>
            <button className="sd-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
              {showForm ? 'Cancel' : '+ New product'}
            </button>
          </div>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <span style={s.statLabel}>Total products</span>
            <span style={s.statValue}>{products.length}</span>
          </div>
          <div style={s.statCard}>
            <span style={s.statLabel}>Total stock</span>
            <span style={s.statValue}>{totalStock}</span>
          </div>
          <div style={s.statCard}>
            <span style={s.statLabel}>Inventory value</span>
            <span style={s.statValue}>₹{totalValue.toLocaleString()}</span>
          </div>
          <div style={s.statCard}>
            <span style={s.statLabel}>Low stock items</span>
            <span style={{ ...s.statValue, color: products.filter(p => p.stock < 10).length > 0 ? '#f09595' : '#c8a96e' }}>
              {products.filter(p => p.stock < 10).length}
            </span>
          </div>
        </div>

        {showForm && (
          <div style={s.formCard}>
            <h2 style={s.formTitle}>{editingProduct ? 'Edit product' : 'Add new product'}</h2>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formGrid}>
                <div style={s.field}>
                  <label style={s.label}>Product name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="sd-input" placeholder="Nike Air Max 270" required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="sd-select">
                    <option value="shoes">Shoes</option>
                    <option value="clothing">Clothing</option>
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Price (₹)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} className="sd-input" placeholder="2999" required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Stock quantity</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} className="sd-input" placeholder="50" required />
                </div>
              </div>
              <div style={s.field}>
                <label style={s.label}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="sd-textarea" placeholder="Describe your product..." required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Image URL</label>
                <input name="images" value={form.images} onChange={handleChange} className="sd-input" placeholder="https://images.unsplash.com/..." />
              </div>
              {form.images && (
                <div style={s.imgPreview}>
                  <img src={form.images} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} onError={e => e.target.style.display = 'none'} />
                  <span style={{ fontSize: '12px', color: '#444441' }}>Image preview</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="sd-outline" onClick={resetForm}>Cancel</button>
                <button type="submit" className="sd-primary">{editingProduct ? 'Update product' : 'Create product'}</button>
              </div>
            </form>
          </div>
        )}

        <div style={s.tableCard}>
          <div style={s.tableHeader}>
            <span style={s.tableTitle}>Your products</span>
            <span style={{ fontSize: '12px', color: '#333' }}>{products.length} items</span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', gap: '8px' }}>
              {['0s', '0.2s', '0.4s'].map(d => (
                <div key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8a96e', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: d }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#333' }}>
              <p style={{ fontSize: '16px', color: '#444441', marginBottom: '8px' }}>No products yet</p>
              <p style={{ fontSize: '13px' }}>Click "+ New product" to add your first product</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr style={s.thead}>
                    <th style={s.th}>Product</th>
                    <th style={s.th}>Category</th>
                    <th style={s.th}>Price</th>
                    <th style={s.th}>Stock</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <tr key={product._id} className="sd-row" style={{ ...s.tr, animationDelay: `${i * 0.04}s` }}>
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={s.productImg}>
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} onError={e => e.target.style.display = 'none'} />
                            ) : (
                              <span style={{ fontSize: '16px', color: '#1e1e1e' }}>◻</span>
                            )}
                          </div>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: '500', color: '#d3d1c7' }}>{product.name}</p>
                            <p style={{ fontSize: '11px', color: '#333', marginTop: '2px' }}>{product.description?.slice(0, 40)}...</p>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}><span style={s.catBadge}>{product.category}</span></td>
                      <td style={{ ...s.td, color: '#c8a96e', fontWeight: '600' }}>₹{product.price.toLocaleString()}</td>
                      <td style={s.td}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: product.stock < 10 ? '#f09595' : '#d3d1c7' }}>
                          {product.stock}
                          {product.stock < 10 && <span style={{ fontSize: '10px', color: '#f09595', marginLeft: '4px' }}>low</span>}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '4px', padding: '3px 8px', fontWeight: '500', color: product.status === 'active' ? '#3B6D11' : '#A32D2D', background: product.status === 'active' ? 'rgba(59,109,17,0.1)' : 'rgba(163,45,45,0.1)', border: product.status === 'active' ? '1px solid rgba(59,109,17,0.2)' : '1px solid rgba(163,45,45,0.2)' }}>
                          {product.status}
                        </span>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="sd-edit" onClick={() => handleEdit(product)}>Edit</button>
                          <button className="sd-delete" onClick={() => handleDelete(product._id)} disabled={deletingId === product._id}>
                            {deletingId === product._id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div style={{ ...s.toast, borderColor: toast.type === 'error' ? 'rgba(163,45,45,0.3)' : '#2a2a2a' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: toast.type === 'error' ? '#E24B4A' : '#3B6D11' }} />
          {toast.msg}
        </div>
      )}
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#0a0a0a', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: '#e8e6e1' },
  header: { borderBottom: '1px solid #1a1a1a', padding: '0 2.5rem' },
  headerInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem 0' },
  title: { fontSize: '28px', fontWeight: '500', color: '#f0ede6', letterSpacing: '-0.01em', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#444441' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
  statCard: { background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' },
  statLabel: { fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#333' },
  statValue: { fontSize: '24px', fontWeight: '600', color: '#c8a96e', letterSpacing: '-0.02em' },
  formCard: { background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '1.75rem', animation: 'fadeIn 0.3s ease' },
  formTitle: { fontSize: '16px', fontWeight: '500', color: '#f0ede6', marginBottom: '1.25rem', letterSpacing: '-0.01em' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444441' },
  imgPreview: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px' },
  tableCard: { background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #1a1a1a' },
  tableTitle: { fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444441' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#0a0a0a' },
  th: { padding: '10px 16px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#333', textAlign: 'left', borderBottom: '1px solid #1a1a1a', fontWeight: '400' },
  tr: { borderBottom: '1px solid #141414', transition: 'background 0.15s', animation: 'fadeIn 0.3s ease both' },
  td: { padding: '14px 16px', fontSize: '13px', color: '#888780', verticalAlign: 'middle' },
  productImg: { width: '44px', height: '44px', borderRadius: '6px', background: '#141414', border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  catBadge: { fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888780', background: '#141414', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '3px 8px' },
  toast: { position: 'fixed', bottom: '2rem', right: '2rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '12px 20px', fontSize: '13px', color: '#d3d1c7', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 999, animation: 'slideUp 0.3s ease' },
};

export default SellerDashboard;