import axios from 'axios';

const AUTH_URL = 'http://localhost:3001';
const PRODUCT_URL = 'http://localhost:3002';
const CART_URL = 'http://localhost:3003';
const ORDER_URL = 'http://localhost:3004';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Auth headers
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// AUTH APIs
export const authAPI = {
  register: (data) => axios.post(`${AUTH_URL}/auth/register`, data),
  login: (data) => axios.post(`${AUTH_URL}/auth/login`, data),
  getMe: () => axios.get(`${AUTH_URL}/auth/me`, authHeaders())
};

// PRODUCT APIs
export const productAPI = {
  getAll: (params) => axios.get(`${PRODUCT_URL}/products`, { params }),
  getOne: (id) => axios.get(`${PRODUCT_URL}/products/${id}`),
  create: (data) => axios.post(`${PRODUCT_URL}/products`, data, authHeaders()),
  update: (id, data) => axios.patch(`${PRODUCT_URL}/products/${id}`, data, authHeaders()),
  delete: (id) => axios.delete(`${PRODUCT_URL}/products/${id}`, authHeaders())
};

// CART APIs
export const cartAPI = {
  getCart: () => axios.get(`${CART_URL}/cart`, authHeaders()),
  addItem: (data) => axios.post(`${CART_URL}/cart/items`, data, authHeaders()),
  updateItem: (productId, data) => axios.patch(`${CART_URL}/cart/items/${productId}`, data, authHeaders()),
  removeItem: (productId) => axios.delete(`${CART_URL}/cart/items/${productId}`, authHeaders()),
  clearCart: () => axios.delete(`${CART_URL}/cart`, authHeaders())
};

// ORDER APIs
export const orderAPI = {
  create: (data) => axios.post(`${ORDER_URL}/orders`, data, authHeaders()),
  getMyOrders: () => axios.get(`${ORDER_URL}/orders/me`, authHeaders()),
  getOne: (id) => axios.get(`${ORDER_URL}/orders/${id}`, authHeaders()),
  cancel: (id) => axios.post(`${ORDER_URL}/orders/${id}/cancel`, {}, authHeaders())
};