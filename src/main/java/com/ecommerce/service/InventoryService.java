package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.exception.InsufficientStockException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryService {

    private static final Logger logger = LoggerFactory.getLogger(InventoryService.class);
    private static final int LOW_STOCK_THRESHOLD = 10;

    private final ProductRepository productRepository;

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public void updateStock(Long productId, Integer newStockQuantity) {
        logger.info("Updating stock for product: {} to {}", productId, newStockQuantity);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        product.setStockQuantity(newStockQuantity);
        product.setAvailable(newStockQuantity > 0);

        productRepository.save(product);
        logger.info("Stock updated successfully for product: {}", productId);
    }

    @Transactional
    public void deductStock(Long productId, Integer quantity) {
        logger.debug("Deducting {} units from product: {}", quantity, productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (product.getStockQuantity() < quantity) {
            throw new InsufficientStockException(
                    product.getName(),
                    quantity,
                    product.getStockQuantity());
        }

        product.setStockQuantity(product.getStockQuantity() - quantity);
        product.setAvailable(product.getStockQuantity() > 0);

        productRepository.save(product);
        logger.debug("Stock deducted successfully for product: {}", productId);
    }

    @Transactional
    public void restoreStock(Long productId, Integer quantity) {
        logger.info("Restoring {} units to product: {}", quantity, productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        product.setStockQuantity(product.getStockQuantity() + quantity);
        product.setAvailable(true);

        productRepository.save(product);
        logger.info("Stock restored successfully for product: {}", productId);
    }

    public void validateStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (product.getStockQuantity() < quantity) {
            throw new InsufficientStockException(
                    product.getName(),
                    quantity,
                    product.getStockQuantity());
        }
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findByStockQuantityLessThan(LOW_STOCK_THRESHOLD);
    }
}
