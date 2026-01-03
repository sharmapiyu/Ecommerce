import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <p className="dashboard-subtitle">Manage your e-commerce store</p>

            <div className="dashboard-grid">
                <Link to="/admin/products" className="dashboard-card">
                    <div className="card-icon">📦</div>
                    <h3>Manage Products</h3>
                    <p>Add, edit, or delete products</p>
                </Link>

                <Link to="/admin/inventory" className="dashboard-card">
                    <div className="card-icon">📊</div>
                    <h3>Manage Inventory</h3>
                    <p>Update stock levels</p>
                </Link>

                <Link to="/admin/orders" className="dashboard-card">
                    <div className="card-icon">🛒</div>
                    <h3>All Orders</h3>
                    <p>View all customer orders</p>
                </Link>

                <Link to="/products" className="dashboard-card">
                    <div className="card-icon">🏪</div>
                    <h3>View Store</h3>
                    <p>Browse products as customer</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
