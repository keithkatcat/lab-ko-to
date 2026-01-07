package org.example.labkoto.api.security;

import org.example.labkoto.api.model.User;
import org.example.labkoto.repositories.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @SuppressWarnings ("NullableProblems")
    @Override
    public UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        String role = "admin".equalsIgnoreCase(user.getAccountType()) ? "ROLE_ADMIN" : "ROLE_USER";
        GrantedAuthority authority = new SimpleGrantedAuthority(role);

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword()) //
            .authorities(Collections.singleton(authority))
            .build();
    }
}
