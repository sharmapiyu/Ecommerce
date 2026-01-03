import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import orderService from '../services/orderService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProductListPage.css';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        categoryId: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'id',
        sortDir: 'ASC'
    });

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12;

    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, [page, filters]);

    const loadProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await productService.getProducts(page, pageSize, filters);
            setProducts(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await productService.getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Failed to load categories');
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
        setPage(0);
    };

    const handleAddToCart = (product) => {
        const existingItem = cart.find(item => item.productId === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { productId: product.id, quantity: 1, product }]);
        }
        setShowCart(true);
    };

    const handleRemoveFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            handleRemoveFromCart(productId);
            return;
        }
        setCart(cart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        ));
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            alert('Cart is empty');
            return;
        }

        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
                paymentMethod: 'CREDIT_CARD'
            };

            await orderService.placeOrder(orderData);
            alert('Order placed successfully! Check your order history.');
            setCart([]);
            setShowCart(false);
            navigate('/orders');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to place order');
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0).toFixed(2);
    };

    if (loading && products.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="product-list-page">
            <div className="page-header">
                <h1>Products</h1>
                <button onClick={() => setShowCart(!showCart)} className="btn btn-primary">
                    Cart ({cart.length})
                </button>
            </div>

            {/* Filters */}
            <div className="filters">
                <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                />

                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                />

                <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                    <option value="id">Sort by ID</option>
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                </select>

                <select name="sortDir" value={filters.sortDir} onChange={handleFilterChange}>
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Cart Sidebar */}
            {showCart && (
                <div className="cart-sidebar">
                    <div className="cart-header">
                        <h3>Shopping Cart</h3>
                        <button onClick={() => setShowCart(false)} className="btn-close">×</button>
                    </div>
                    <div className="cart-items">
                        {cart.length === 0 ? (
                            <p>Cart is empty</p>
                        ) : (
                            cart.map(item => (
                                <div key={item.productId} className="cart-item">
                                    <div className="cart-item-info">
                                        <h4>{item.product.name}</h4>
                                        <p>${item.product.price}</p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                                        />
                                        <button onClick={() => handleRemoveFromCart(item.productId)} className="btn-remove">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {cart.length > 0 && (
                        <div className="cart-footer">
                            <div className="cart-total">
                                <strong>Total: ${calculateTotal()}</strong>
                            </div>
                            <button onClick={handlePlaceOrder} className="btn btn-primary btn-block">
                                Place Order
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Products Grid */}
            <div className="products-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                        className="btn"
                    >
                        Previous
                    </button>
                    <span>Page {page + 1} of {totalPages}</span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages - 1}
                        className="btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductListPage;
