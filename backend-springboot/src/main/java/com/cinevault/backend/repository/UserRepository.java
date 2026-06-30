package com.cinevault.backend.repository; // Make sure this matches your actual package name!

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinevault.backend.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // We are teaching Spring Data how to search for a user by their name!
    Optional<User> findByUsername(String username);
    
    // Quick helper to check if a username is already taken during signup
    Boolean existsByUsername(String username);
}