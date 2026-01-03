import { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import './AllOrdersPage.css';

const AllOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        loadOrders();
    }, [page]);

    const loadOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await orderService.getAllOrders(page, pageSize);
            setOrders(data.content);
            setTotalPages(data.totalPages);
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

    if (loading && orders.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="all-orders-page">
            <h1>All Orders</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.username}</td>
                                <td>{order.items.length} item(s)</td>
                                <td>${order.totalAmount}</td>
                                <td>
                                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${getPaymentStatusClass(order.paymentStatus)}`}>
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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

export default AllOrdersPage;
