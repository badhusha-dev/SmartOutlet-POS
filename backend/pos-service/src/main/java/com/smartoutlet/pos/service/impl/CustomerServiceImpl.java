package com.smartoutlet.pos.service.impl;

import com.smartoutlet.pos.dto.CustomerDto;
import com.smartoutlet.pos.entity.Customer;
import com.smartoutlet.pos.exception.ResourceNotFoundException;
import com.smartoutlet.pos.repository.CustomerRepository;
import com.smartoutlet.pos.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomerServiceImpl implements CustomerService {
    
    private final CustomerRepository customerRepository;
    
    @Override
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return mapToDto(customer);
    }
    
    @Override
    public CustomerDto createCustomer(CustomerDto customerDto) {
        Customer customer = mapToEntity(customerDto);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        Customer savedCustomer = customerRepository.save(customer);
        return mapToDto(savedCustomer);
    }
    
    @Override
    public CustomerDto updateCustomer(Long id, CustomerDto customerDto) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        
        existingCustomer.setFirstName(customerDto.getFirstName());
        existingCustomer.setLastName(customerDto.getLastName());
        existingCustomer.setEmail(customerDto.getEmail());
        existingCustomer.setPhone(customerDto.getPhone());
        existingCustomer.setAddress(customerDto.getAddress());
        existingCustomer.setCity(customerDto.getCity());
        existingCustomer.setState(customerDto.getState());
        existingCustomer.setZipCode(customerDto.getZipCode());
        existingCustomer.setCountry(customerDto.getCountry());
        existingCustomer.setCustomerType(Customer.CustomerType.valueOf(customerDto.getCustomerType()));
        existingCustomer.setUpdatedAt(LocalDateTime.now());
        
        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return mapToDto(updatedCustomer);
    }
    
    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customer.setIsActive(false);
        customer.setUpdatedAt(LocalDateTime.now());
        customerRepository.save(customer);
    }
    
    @Override
    public List<CustomerDto> searchCustomers(String searchTerm) {
        return customerRepository.searchCustomers(searchTerm)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public CustomerDto getCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
        return mapToDto(customer);
    }
    
    @Override
    public CustomerDto getCustomerByPhone(String phone) {
        Customer customer = customerRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with phone: " + phone));
        return mapToDto(customer);
    }
    
    @Override
    public List<CustomerDto> getCustomersByType(String customerType) {
        Customer.CustomerType type = Customer.CustomerType.valueOf(customerType.toUpperCase());
        return customerRepository.findByCustomerType(type)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public CustomerDto addLoyaltyPoints(Long customerId, Integer points) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        customer.addLoyaltyPoints(points);
        customer.setUpdatedAt(LocalDateTime.now());
        Customer updatedCustomer = customerRepository.save(customer);
        return mapToDto(updatedCustomer);
    }
    
    @Override
    public CustomerDto updateCustomerSpending(Long customerId, Double amount) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        customer.addToTotalSpent(amount);
        customer.setUpdatedAt(LocalDateTime.now());
        Customer updatedCustomer = customerRepository.save(customer);
        return mapToDto(updatedCustomer);
    }
    
    @Override
    public List<CustomerDto> getTopCustomersBySpending(int limit) {
        return customerRepository.findByTotalSpentGreaterThanEqual(0.0)
                .stream()
                .limit(limit)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CustomerDto> getTopCustomersByLoyaltyPoints(int limit) {
        return customerRepository.findByLoyaltyPointsGreaterThanEqual(0)
                .stream()
                .limit(limit)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    private CustomerDto mapToDto(Customer customer) {
        return CustomerDto.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .city(customer.getCity())
                .state(customer.getState())
                .zipCode(customer.getZipCode())
                .country(customer.getCountry())
                .loyaltyPoints(customer.getLoyaltyPoints())
                .totalSpent(customer.getTotalSpent())
                .visitCount(customer.getVisitCount())
                .isActive(customer.getIsActive())
                .customerType(customer.getCustomerType().name())
                .fullName(customer.getFullName())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
    
    private Customer mapToEntity(CustomerDto customerDto) {
        return Customer.builder()
                .firstName(customerDto.getFirstName())
                .lastName(customerDto.getLastName())
                .email(customerDto.getEmail())
                .phone(customerDto.getPhone())
                .address(customerDto.getAddress())
                .city(customerDto.getCity())
                .state(customerDto.getState())
                .zipCode(customerDto.getZipCode())
                .country(customerDto.getCountry())
                .loyaltyPoints(customerDto.getLoyaltyPoints() != null ? customerDto.getLoyaltyPoints() : 0)
                .totalSpent(customerDto.getTotalSpent() != null ? customerDto.getTotalSpent() : 0.0)
                .visitCount(customerDto.getVisitCount() != null ? customerDto.getVisitCount() : 0)
                .isActive(customerDto.getIsActive() != null ? customerDto.getIsActive() : true)
                .customerType(customerDto.getCustomerType() != null ? 
                    Customer.CustomerType.valueOf(customerDto.getCustomerType()) : Customer.CustomerType.REGULAR)
                .build();
    }
} 