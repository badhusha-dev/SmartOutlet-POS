package com.smartoutlet.product.config;

import com.smartoutlet.product.entity.Category;
import com.smartoutlet.product.entity.Product;
import com.smartoutlet.product.repository.CategoryRepository;
import com.smartoutlet.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    @Override
    public void run(String... args) {
        log.info("Initializing product data...");
        
        // Create default categories
        createDefaultCategories();
        
        // Create sample products
        createSampleProducts();
        
        log.info("Product data initialization completed");
    }
    
    private void createDefaultCategories() {
        // Electronics
        if (!categoryRepository.existsByName("Electronics")) {
            Category electronics = new Category("Electronics", "Electronic devices and accessories");
            electronics.setSortOrder(1);
            categoryRepository.save(electronics);
            log.info("Created Electronics category");
        }
        
        // Beverages
        if (!categoryRepository.existsByName("Beverages")) {
            Category beverages = new Category("Beverages", "Drinks and beverage products");
            beverages.setSortOrder(2);
            categoryRepository.save(beverages);
            log.info("Created Beverages category");
        }
        
        // Snacks
        if (!categoryRepository.existsByName("Snacks")) {
            Category snacks = new Category("Snacks", "Snack foods and confectionery");
            snacks.setSortOrder(3);
            categoryRepository.save(snacks);
            log.info("Created Snacks category");
        }
        
        // Groceries
        if (!categoryRepository.existsByName("Groceries")) {
            Category groceries = new Category("Groceries", "Daily grocery items");
            groceries.setSortOrder(4);
            categoryRepository.save(groceries);
            log.info("Created Groceries category");
        }
        
        // Personal Care
        if (!categoryRepository.existsByName("Personal Care")) {
            Category personalCare = new Category("Personal Care", "Personal hygiene and care products");
            personalCare.setSortOrder(5);
            categoryRepository.save(personalCare);
            log.info("Created Personal Care category");
        }
    }
    
    private void createSampleProducts() {
        // Only create sample products if none exist
        if (productRepository.count() == 0) {
            createElectronicsProducts();
            createBeverageProducts();
            createSnackProducts();
            createGroceryProducts();
            createPersonalCareProducts();
        }
    }
    
    private void createElectronicsProducts() {
        Category electronics = categoryRepository.findByName("Electronics").orElse(null);
        if (electronics != null) {
            // Smartphone
            if (!productRepository.existsBySku("ELEC-001")) {
                Product smartphone = new Product();
                smartphone.setName("Smartphone XYZ");
                smartphone.setDescription("Latest Android smartphone with 128GB storage");
                smartphone.setSku("ELEC-001");
                smartphone.setBarcode("1234567890123");
                smartphone.setPrice(new BigDecimal("299.99"));
                smartphone.setCostPrice(new BigDecimal("199.99"));
                smartphone.setStockQuantity(25);
                smartphone.setMinStockLevel(5);
                smartphone.setCategory(electronics);
                smartphone.setBrand("TechBrand");
                smartphone.setUnitOfMeasure("PIECE");
                productRepository.save(smartphone);
                log.info("Created sample product: Smartphone XYZ");
            }
            
            // Wireless Headphones
            if (!productRepository.existsBySku("ELEC-002")) {
                Product headphones = new Product();
                headphones.setName("Wireless Headphones");
                headphones.setDescription("Bluetooth wireless headphones with noise cancellation");
                headphones.setSku("ELEC-002");
                headphones.setBarcode("1234567890124");
                headphones.setPrice(new BigDecimal("79.99"));
                headphones.setCostPrice(new BigDecimal("49.99"));
                headphones.setStockQuantity(50);
                headphones.setMinStockLevel(10);
                headphones.setCategory(electronics);
                headphones.setBrand("AudioTech");
                headphones.setUnitOfMeasure("PIECE");
                productRepository.save(headphones);
                log.info("Created sample product: Wireless Headphones");
            }
        }
    }
    
    private void createBeverageProducts() {
        Category beverages = categoryRepository.findByName("Beverages").orElse(null);
        if (beverages != null) {
            // Coca Cola
            if (!productRepository.existsBySku("BEV-001")) {
                Product coke = new Product();
                coke.setName("Coca Cola 500ml");
                coke.setDescription("Classic Coca Cola soft drink");
                coke.setSku("BEV-001");
                coke.setBarcode("1234567890125");
                coke.setPrice(new BigDecimal("1.50"));
                coke.setCostPrice(new BigDecimal("0.90"));
                coke.setStockQuantity(100);
                coke.setMinStockLevel(20);
                coke.setCategory(beverages);
                coke.setBrand("Coca-Cola");
                coke.setUnitOfMeasure("BOTTLE");
                productRepository.save(coke);
                log.info("Created sample product: Coca Cola 500ml");
            }
            
            // Water Bottle
            if (!productRepository.existsBySku("BEV-002")) {
                Product water = new Product();
                water.setName("Natural Water 1L");
                water.setDescription("Pure natural drinking water");
                water.setSku("BEV-002");
                water.setBarcode("1234567890126");
                water.setPrice(new BigDecimal("0.75"));
                water.setCostPrice(new BigDecimal("0.45"));
                water.setStockQuantity(200);
                water.setMinStockLevel(30);
                water.setCategory(beverages);
                water.setBrand("AquaPure");
                water.setUnitOfMeasure("BOTTLE");
                productRepository.save(water);
                log.info("Created sample product: Natural Water 1L");
            }
        }
    }
    
    private void createSnackProducts() {
        Category snacks = categoryRepository.findByName("Snacks").orElse(null);
        if (snacks != null) {
            // Chocolate Bar
            if (!productRepository.existsBySku("SNK-001")) {
                Product chocolate = new Product();
                chocolate.setName("Milk Chocolate Bar");
                chocolate.setDescription("Creamy milk chocolate bar 100g");
                chocolate.setSku("SNK-001");
                chocolate.setBarcode("1234567890127");
                chocolate.setPrice(new BigDecimal("2.25"));
                chocolate.setCostPrice(new BigDecimal("1.35"));
                chocolate.setStockQuantity(75);
                chocolate.setMinStockLevel(15);
                chocolate.setCategory(snacks);
                chocolate.setBrand("ChocoBrand");
                chocolate.setUnitOfMeasure("PIECE");
                productRepository.save(chocolate);
                log.info("Created sample product: Milk Chocolate Bar");
            }
        }
    }
    
    private void createGroceryProducts() {
        Category groceries = categoryRepository.findByName("Groceries").orElse(null);
        if (groceries != null) {
            // Rice
            if (!productRepository.existsBySku("GRC-001")) {
                Product rice = new Product();
                rice.setName("Basmati Rice 5kg");
                rice.setDescription("Premium quality basmati rice");
                rice.setSku("GRC-001");
                rice.setBarcode("1234567890128");
                rice.setPrice(new BigDecimal("12.99"));
                rice.setCostPrice(new BigDecimal("8.99"));
                rice.setStockQuantity(40);
                rice.setMinStockLevel(8);
                rice.setCategory(groceries);
                rice.setBrand("RiceKing");
                rice.setUnitOfMeasure("KG");
                productRepository.save(rice);
                log.info("Created sample product: Basmati Rice 5kg");
            }
        }
    }
    
    private void createPersonalCareProducts() {
        Category personalCare = categoryRepository.findByName("Personal Care").orElse(null);
        if (personalCare != null) {
            // Toothpaste
            if (!productRepository.existsBySku("PC-001")) {
                Product toothpaste = new Product();
                toothpaste.setName("Whitening Toothpaste");
                toothpaste.setDescription("Advanced whitening toothpaste 100ml");
                toothpaste.setSku("PC-001");
                toothpaste.setBarcode("1234567890129");
                toothpaste.setPrice(new BigDecimal("3.99"));
                toothpaste.setCostPrice(new BigDecimal("2.49"));
                toothpaste.setStockQuantity(60);
                toothpaste.setMinStockLevel(12);
                toothpaste.setCategory(personalCare);
                toothpaste.setBrand("DentalCare");
                toothpaste.setUnitOfMeasure("TUBE");
                productRepository.save(toothpaste);
                log.info("Created sample product: Whitening Toothpaste");
            }
        }
    }
}