package com.smartoutlet.expense.infrastructure.persistence;

import com.smartoutlet.expense.domain.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByOutletId(Long outletId);
    List<Expense> findByCategory(String category);
    List<Expense> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Expense> findByOutletIdAndCategory(Long outletId, String category);
    List<Expense> findByOutletIdAndCreatedAtBetween(Long outletId, LocalDateTime start, LocalDateTime end);
    List<Expense> findByCategoryAndCreatedAtBetween(String category, LocalDateTime start, LocalDateTime end);
    List<Expense> findByOutletIdAndCategoryAndCreatedAtBetween(Long outletId, String category, LocalDateTime start, LocalDateTime end);
} 