package com.ecommerce.service;

import com.ecommerce.entity.Payment;
import com.ecommerce.entity.Order;
import com.ecommerce.exception.PaymentFailedException;
import com.ecommerce.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private static final Random random = new Random();

    private final PaymentRepository paymentRepository;

    @Transactional
    public Payment processPayment(Order order, String paymentMethod) {
        logger.info("Processing payment for order: {}", order.getId());

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionId(generateTransactionId());
        payment.setStatus(Payment.PaymentStatus.PENDING);

        // Simulate payment processing with 70% success rate
        boolean paymentSuccess = simulatePaymentProcessing();

        if (paymentSuccess) {
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            logger.info("Payment successful for order: {}", order.getId());
        } else {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            logger.error("Payment failed for order: {}", order.getId());
        }

        Payment savedPayment = paymentRepository.save(payment);

        if (!paymentSuccess) {
            throw new PaymentFailedException("Payment processing failed. Please try again.");
        }

        return savedPayment;
    }

    private boolean simulatePaymentProcessing() {
        // Simulate processing delay
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // 70% success rate
        return random.nextInt(100) < 70;
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElse(null);
    }
}
