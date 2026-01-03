package com.ecommerce.controller;

import com.ecommerce.dto.StockUpdateRequest;
import com.ecommerce.entity.Product;
import com.ecommerce.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {

    private final InventoryService inventoryService;

    @PutMapping("/{productId}")
    public ResponseEntity<Map<String, String>> updateStock(
            @PathVariable Long productId,
            @Valid @RequestBody StockUpdateRequest request) {
        inventoryService.updateStock(productId, request.getStockQuantity());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Stock updated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Map<String, Object>>> getLowStockProducts() {
        List<Product> lowStockProducts = inventoryService.getLowStockProducts();

        List<Map<String, Object>> response = lowStockProducts.stream()
                .map(product -> {
                    Map<String, Object> productMap = new HashMap<>();
                    productMap.put("id", product.getId());
                    productMap.put("name", product.getName());
                    productMap.put("stockQuantity", product.getStockQuantity());
                    productMap.put("categoryName", product.getCategory().getName());
                    return productMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
