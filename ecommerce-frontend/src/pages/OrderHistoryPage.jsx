import { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await orderService.getMyOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return 'badge-success';
            case 'CANCELLED':
                return 'badge-danger';
            case 'PENDING':
                return 'badge-warning';
            default:
                return 'badge-secondary';
        }
    };

    const getPaymentStatusClass = (status) => {
        switch (status) {
            case 'SUCCESS':
                return 'badge-success';
            case 'FAILED':
                return 'badge-danger';
            case 'PENDING':
                return 'badge-warning';
            default:
                return 'badge-secondary';
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="order-history-page">
            <h1>My Orders</h1>

            {error && <div className="error-message">{error}</div>}

            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3>Order #{order.id}</h3>
                                    <p className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="order-badges">
                                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className={`badge ${getPaymentStatusClass(order.paymentStatus)}`}>
                                        Payment: {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="order-items">
                                <h4>Items:</h4>
                                {order.items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <span className="item-name">{item.productName}</span>
                                        <span className="item-quantity">Qty: {item.quantity}</span>
                                        <span className="item-price">${item.price}</span>
                                        <span className="item-subtotal">${item.subtotal}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    <strong>Total: ${order.totalAmount}</strong>
                                </div>
                                <div className="order-payment">
                                    Payment Method: {order.paymentMethod}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
