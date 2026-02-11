package org.aadi.product_service.service;

import org.aadi.product_service.domain.Category;
import org.aadi.product_service.repository.CategoryRepository;
import org.aadi.product_service.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<Category> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        
        // Calculate product count for each category
        return categories.stream().map(category -> {
            int count = productRepository.findByCategory(category.getName()).size();
            category.setProductCount(count);
            return category;
        }).collect(Collectors.toList());
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
}
