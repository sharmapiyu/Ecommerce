package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

        Page<Product> findByAvailableTrue(Pageable pageable);

        Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

        Page<Product> findByCategoryIdAndAvailableTrue(Long categoryId, Pageable pageable);

        @Query("SELECT p FROM Product p WHERE p.available = true " +
                        "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
                        "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
                        "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
        Page<Product> findByFilters(
                        @Param("categoryId") Long categoryId,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice,
                        Pageable pageable);

        @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.stockQuantity < :threshold")
        List<Product> findByStockQuantityLessThan(@Param("threshold") Integer threshold);
}
