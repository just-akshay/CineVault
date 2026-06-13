package com.cinevault.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinevault.backend.model.VaultItem;

@Repository // Tells Spring Boot that this file is responsible for talking to MySQL
public interface VaultItemRepository extends JpaRepository<VaultItem, Long> {
    // That's it! No manual SQL logic needed here.
}