// src/services/productService.js
import { apiCall } from './api';

const productService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters);
    const data = await apiCall(`/products?${params}`);
    return data.products || [];
  },

  async getById(id) {
    const data = await apiCall(`/products/${id}`);
    return data.product;
  },

  async create(productData) {
    return await apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async update(id, productData) {
    return await apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  async delete(id) {
    return await apiCall(`/products/${id}`, { method: 'DELETE' });
  },
};

export default productService;