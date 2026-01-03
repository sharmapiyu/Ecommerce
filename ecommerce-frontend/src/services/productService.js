import api from './api';

const productService = {
    async getProducts(page = 0, size = 10, filters = {}) {
        const params = new URLSearchParams({
            page,
            size,
            sortBy: filters.sortBy || 'id',
            sortDir: filters.sortDir || 'ASC',
        });

        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

        const response = await api.get(`/products?${params}`);
        return response.data;
    },

    async getProductById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    async createProduct(productData) {
        const response = await api.post('/products', productData);
        return response.data;
    },

    async updateProduct(id, productData) {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    async deleteProduct(id) {
        await api.delete(`/products/${id}`);
    },

    async getCategories() {
        const response = await api.get('/categories');
        return response.data;
    },

    async createCategory(categoryData) {
        const response = await api.post('/categories', categoryData);
        return response.data;
    }
};

export default productService;
