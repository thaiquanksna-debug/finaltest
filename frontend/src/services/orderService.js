// src/services/orderService.js
import { apiCall } from './api';

export async function createOrder(orderData) {
    return await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  };

const orderService = {
  // async createOrder(orderData) {
  //   return await apiCall('/orders', {
  //     method: 'POST',
  //     body: JSON.stringify(orderData),
  //   });
  // },

  async getMyOrders() {
    const data = await apiCall('/orders/my');
    return data.orders || [];
  },

  async getAll() {
    const data = await apiCall('/orders');
    return data.orders || [];
  },

  async cancel(id) {
    return await apiCall(`/orders/${id}/cancel`, { method: 'PUT' });
  },

  async updateStatus(id, status) {
    return await apiCall(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

export default orderService;