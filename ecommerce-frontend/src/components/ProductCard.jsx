import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, showActions = true }) => {
    return (
        <div className="product-card">
            <div className="product-image">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                ) : (
                    <div className="product-image-placeholder">No Image</div>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                    <span className="product-price">${product.price}</span>
                    <span className={`product-stock ${product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                </div>
                {showActions && product.stockQuantity > 0 && (
                    <button onClick={() => onAddToCart(product)} className="btn btn-primary">
                        Add to Order
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
