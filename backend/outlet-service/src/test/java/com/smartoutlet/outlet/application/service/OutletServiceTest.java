package com.smartoutlet.outlet.application.service;

import com.smartoutlet.outlet.api.dto.*;
import com.smartoutlet.outlet.domain.model.Outlet;
import com.smartoutlet.outlet.infrastructure.config.OutletNotFoundException;
import com.smartoutlet.outlet.infrastructure.config.OutletAlreadyExistsException;
import com.smartoutlet.outlet.infrastructure.persistence.OutletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Outlet Service Tests")
class OutletServiceTest {

    @Mock
    private OutletRepository outletRepository;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private OutletService outletService;

    private Outlet testOutlet;
    private OutletRequest outletRequest;

    @BeforeEach
    void setUp() {
        // Setup test outlet
        testOutlet = new Outlet();
        testOutlet.setId(1L);
        testOutlet.setName("Test Outlet");
        testOutlet.setDescription("Test Description");
        testOutlet.setAddress("123 Test Street");
        testOutlet.setCity("Test City");
        testOutlet.setState("Test State");
        testOutlet.setPostalCode("12345");
        testOutlet.setCountry("Test Country");
        testOutlet.setPhoneNumber("123-456-7890");
        testOutlet.setEmail("test@outlet.com");
        testOutlet.setIsActive(true);
        testOutlet.setCreatedAt(LocalDateTime.now());
        testOutlet.setUpdatedAt(LocalDateTime.now());

        // Setup test request
        outletRequest = OutletRequest.builder()
                .name("New Outlet")
                .description("New Description")
                .address("456 New Street")
                .city("New City")
                .state("New State")
                .postalCode("67890")
                .country("New Country")
                .phoneNumber("098-765-4321")
                .email("new@outlet.com")
                .build();
    }

    @Test
    @DisplayName("Should create outlet successfully")
    void shouldCreateOutletSuccessfully() {
        // Given
        when(outletRepository.findByName("New Outlet")).thenReturn(Optional.empty());
        when(outletRepository.save(any(Outlet.class))).thenReturn(testOutlet);

        // When
        OutletResponse result = outletService.createOutlet(outletRequest);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Outlet", result.getName());
        assertEquals("Test Description", result.getDescription());
        assertTrue(result.getIsActive());

        verify(outletRepository).findByName("New Outlet");
        verify(outletRepository).save(any(Outlet.class));
        verify(kafkaTemplate).send(eq("outlet-events"), any());
    }

    @Test
    @DisplayName("Should throw OutletAlreadyExistsException when outlet name exists")
    void shouldThrowOutletAlreadyExistsExceptionWhenNameExists() {
        // Given
        when(outletRepository.findByName("New Outlet")).thenReturn(Optional.of(testOutlet));

        // When & Then
        assertThrows(OutletAlreadyExistsException.class, () -> {
            outletService.createOutlet(outletRequest);
        });

        verify(outletRepository).findByName("New Outlet");
        verify(outletRepository, never()).save(any(Outlet.class));
        verify(kafkaTemplate, never()).send(anyString(), any());
    }

    @Test
    @DisplayName("Should get outlet by ID successfully")
    void shouldGetOutletByIdSuccessfully() {
        // Given
        Long outletId = 1L;
        when(outletRepository.findById(outletId)).thenReturn(Optional.of(testOutlet));

        // When
        OutletResponse result = outletService.getOutletById(outletId);

        // Then
        assertNotNull(result);
        assertEquals(outletId, result.getId());
        assertEquals("Test Outlet", result.getName());
        assertEquals("Test Description", result.getDescription());

        verify(outletRepository).findById(outletId);
    }

    @Test
    @DisplayName("Should throw OutletNotFoundException when outlet not found by ID")
    void shouldThrowOutletNotFoundExceptionWhenNotFoundById() {
        // Given
        Long outletId = 999L;
        when(outletRepository.findById(outletId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(OutletNotFoundException.class, () -> {
            outletService.getOutletById(outletId);
        });

        verify(outletRepository).findById(outletId);
    }

    @Test
    @DisplayName("Should get all outlets successfully")
    void shouldGetAllOutletsSuccessfully() {
        // Given
        Outlet outlet2 = new Outlet();
        outlet2.setId(2L);
        outlet2.setName("Second Outlet");
        outlet2.setIsActive(true);

        List<Outlet> outlets = Arrays.asList(testOutlet, outlet2);
        Page<Outlet> outletPage = new PageImpl<>(outlets);
        when(outletRepository.findAll(any(Pageable.class))).thenReturn(outletPage);

        // When
        Page<OutletResponse> result = outletService.getAllOutlets(0, 10, "name", "asc");

        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals("Test Outlet", result.getContent().get(0).getName());
        assertEquals("Second Outlet", result.getContent().get(1).getName());

        verify(outletRepository).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("Should update outlet successfully")
    void shouldUpdateOutletSuccessfully() {
        // Given
        Long outletId = 1L;
        OutletRequest updateRequest = OutletRequest.builder()
                .name("Updated Outlet")
                .description("Updated Description")
                .address("Updated Address")
                .city("Updated City")
                .state("Updated State")
                .postalCode("54321")
                .country("Updated Country")
                .phoneNumber("111-222-3333")
                .email("updated@outlet.com")
                .build();

        when(outletRepository.findById(outletId)).thenReturn(Optional.of(testOutlet));
        when(outletRepository.save(any(Outlet.class))).thenReturn(testOutlet);

        // When
        OutletResponse result = outletService.updateOutlet(outletId, updateRequest);

        // Then
        assertNotNull(result);
        verify(outletRepository).findById(outletId);
        verify(outletRepository).save(any(Outlet.class));
        verify(kafkaTemplate).send(eq("outlet-events"), any());
    }

    @Test
    @DisplayName("Should delete outlet successfully")
    void shouldDeleteOutletSuccessfully() {
        // Given
        Long outletId = 1L;
        when(outletRepository.findById(outletId)).thenReturn(Optional.of(testOutlet));

        // When
        outletService.deleteOutlet(outletId);

        // Then
        verify(outletRepository).findById(outletId);
        verify(outletRepository).save(any(Outlet.class));
        verify(kafkaTemplate).send(eq("outlet-events"), any());
    }

    @Test
    @DisplayName("Should search outlets by name successfully")
    void shouldSearchOutletsByNameSuccessfully() {
        // Given
        String searchQuery = "Test";
        List<Outlet> outlets = Arrays.asList(testOutlet);
        Page<Outlet> outletPage = new PageImpl<>(outlets);
        when(outletRepository.findByNameContainingIgnoreCase(eq(searchQuery), any(Pageable.class)))
                .thenReturn(outletPage);

        // When
        Page<OutletResponse> result = outletService.searchOutlets(searchQuery, 0, 10, "name", "asc");

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Outlet", result.getContent().get(0).getName());

        verify(outletRepository).findByNameContainingIgnoreCase(eq(searchQuery), any(Pageable.class));
    }

    @Test
    @DisplayName("Should get active outlets successfully")
    void shouldGetActiveOutletsSuccessfully() {
        // Given
        List<Outlet> activeOutlets = Arrays.asList(testOutlet);
        Page<Outlet> outletPage = new PageImpl<>(activeOutlets);
        when(outletRepository.findByIsActive(eq(true), any(Pageable.class)))
                .thenReturn(outletPage);

        // When
        Page<OutletResponse> result = outletService.getActiveOutlets(0, 10, "name", "asc");

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertTrue(result.getContent().get(0).getIsActive());

        verify(outletRepository).findByIsActive(eq(true), any(Pageable.class));
    }
}