package com.smartoutlet.auth.config;

import com.smartoutlet.auth.entity.Role;
import com.smartoutlet.auth.entity.User;
import com.smartoutlet.auth.repository.RoleRepository;
import com.smartoutlet.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        log.info("Initializing default data...");
        
        // Create default roles
        createDefaultRoles();
        
        // Create admin user
        createAdminUser();
        
        // Create staff user
        createStaffUser();
        
        log.info("Default data initialization completed");
    }
    
    private void createDefaultRoles() {
        // Create ADMIN role
        if (!roleRepository.existsByName("ADMIN")) {
            Role adminRole = new Role("ADMIN", "Administrator with full access");
            roleRepository.save(adminRole);
            log.info("Created ADMIN role");
        }
        
        // Create STAFF role
        if (!roleRepository.existsByName("STAFF")) {
            Role staffRole = new Role("STAFF", "Staff member with limited access");
            roleRepository.save(staffRole);
            log.info("Created STAFF role");
        }
    }
    
    private void createAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@smartoutlet.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setIsActive(true);
            admin.setIsVerified(true);
            
            // Assign ADMIN role
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));
            
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);
            
            userRepository.save(admin);
            log.info("Created admin user with username: admin and password: admin123");
        }
    }
    
    private void createStaffUser() {
        if (!userRepository.existsByUsername("staff")) {
            User staff = new User();
            staff.setUsername("staff");
            staff.setEmail("staff@smartoutlet.com");
            staff.setPassword(passwordEncoder.encode("staff123"));
            staff.setFirstName("Demo");
            staff.setLastName("Staff");
            staff.setIsActive(true);
            staff.setIsVerified(true);
            
            // Assign STAFF role
            Role staffRole = roleRepository.findByName("STAFF")
                    .orElseThrow(() -> new RuntimeException("STAFF role not found"));
            
            Set<Role> roles = new HashSet<>();
            roles.add(staffRole);
            staff.setRoles(roles);
            
            userRepository.save(staff);
            log.info("Created staff user with username: staff and password: staff123");
        }
    }
}