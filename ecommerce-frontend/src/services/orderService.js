import api from './api';

const orderService = {
    async placeOrder(orderData) {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    async getMyOrders() {
        const response = await api.get('/orders/my-orders');
        return response.data;
    },

    async getOrderById(id) {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    async getAllOrders(page = 0, size = 10) {
        const response = await api.get(`/orders?page=${page}&size=${size}&sortBy=createdAt&sortDir=DESC`);
        return response.data;
    }
};

export default orderService;
