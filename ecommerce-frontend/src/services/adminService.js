import api from './api';

const adminService = {
    async updateStock(productId, stockQuantity) {
        const response = await api.put(`/inventory/${productId}`, { stockQuantity });
        return response.data;
    },

    async getLowStockProducts() {
        const response = await api.get('/inventory/low-stock');
        return response.data;
    }
};

export default adminService;
