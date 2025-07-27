package com.smartoutlet.pos.service;

import com.smartoutlet.pos.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    
    List<CustomerDto> getAllCustomers();
    
    CustomerDto getCustomerById(Long id);
    
    CustomerDto createCustomer(CustomerDto customerDto);
    
    CustomerDto updateCustomer(Long id, CustomerDto customerDto);
    
    void deleteCustomer(Long id);
    
    List<CustomerDto> searchCustomers(String searchTerm);
    
    CustomerDto getCustomerByEmail(String email);
    
    CustomerDto getCustomerByPhone(String phone);
    
    List<CustomerDto> getCustomersByType(String customerType);
    
    CustomerDto addLoyaltyPoints(Long customerId, Integer points);
    
    CustomerDto updateCustomerSpending(Long customerId, Double amount);
    
    List<CustomerDto> getTopCustomersBySpending(int limit);
    
    List<CustomerDto> getTopCustomersByLoyaltyPoints(int limit);
} 