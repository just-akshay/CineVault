package com.cinevault.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cinevault.backend.model.VaultItem;
import com.cinevault.backend.repository.VaultItemRepository;

@Service // Tells Spring Boot to manage this class as our master business logic unit
public class VaultItemService {

    // 1. Hook up our automated database hands (Dependency Injection)
    private final VaultItemRepository repository;

    public VaultItemService(VaultItemRepository repository) {
        this.repository = repository;
    }

    // 2. Business Logic: Fetch everything currently stored in the MySQL vault
    public List<VaultItem> getAllVaultItems() {
        return repository.findAll();
    }

    // 3. Business Logic: Save a fresh movie asset directly into the database
    public VaultItem saveToVault(VaultItem item) {
        return repository.save(item);
    }

    // 4. Business Logic: Delete a movie completely out of the database using its ID
    public void removeFromVault(Long id) {
        repository.deleteById(id);
    }
}