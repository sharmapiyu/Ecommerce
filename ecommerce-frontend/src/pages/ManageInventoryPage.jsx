import { useState, useEffect } from 'react';
import productService from '../services/productService';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import './ManageInventoryPage.css';

const ManageInventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsData, lowStockData] = await Promise.all([
                productService.getProducts(0, 100),
                adminService.getLowStockProducts()
            ]);
            setProducts(productsData.content);
            setLowStockProducts(lowStockData);
        } catch (err) {
            setError('Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async (productId, newStock) => {
        if (newStock < 0) {
            alert('Stock cannot be negative');
            return;
        }

        setUpdating(productId);
        try {
            await adminService.updateStock(productId, parseInt(newStock));
            await loadData();
            alert('Stock updated successfully!');
        } catch (err) {
            alert('Failed to update stock');
        } finally {
            setUpdating(null);
        }
    };

    const handleStockChange = (productId, value) => {
        setProducts(products.map(p =>
            p.id === productId ? { ...p, stockQuantity: value } : p
        ));
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="manage-inventory-page">
            <h1>Manage Inventory</h1>

            {error && <div className="error-message">{error}</div>}

            {lowStockProducts.length > 0 && (
                <div className="low-stock-alert">
                    <h3>⚠️ Low Stock Alert</h3>
                    <p>{lowStockProducts.length} product(s) have low stock (below 10 units)</p>
                    <div className="low-stock-list">
                        {lowStockProducts.map(product => (
                            <div key={product.id} className="low-stock-item">
                                <span>{product.name}</span>
                                <span className="stock-badge">{product.stockQuantity} units</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="inventory-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                            <th>New Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className={product.stockQuantity < 10 ? 'low-stock-row' : ''}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.categoryName}</td>
                                <td>
                                    <span className={`stock-badge ${product.stockQuantity < 10 ? 'low' : ''}`}>
                                        {product.stockQuantity}
                                    </span>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={product.stockQuantity}
                                        onChange={(e) => handleStockChange(product.id, e.target.value)}
                                        min="0"
                                        className="stock-input"
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleUpdateStock(product.id, product.stockQuantity)}
                                        disabled={updating === product.id}
                                        className="btn btn-primary btn-sm"
                                    >
                                        {updating === product.id ? 'Updating...' : 'Update'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageInventoryPage;
