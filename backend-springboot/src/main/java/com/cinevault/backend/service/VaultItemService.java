package com.cinevault.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinevault.backend.model.User;
import com.cinevault.backend.model.VaultItem;
import com.cinevault.backend.repository.UserRepository;
import com.cinevault.backend.repository.VaultItemRepository;

@Service
public class VaultItemService {

    @Autowired
    private VaultItemRepository vaultRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Fetch only the movies owned by this username
    public List<VaultItem> getVaultItems(String username) {
        return vaultRepository.findByUser_Username(username);
    }

    // 2. Find the user in the DB, attach them to the movie, and save it
    public VaultItem addVaultItem(VaultItem item, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        item.setUser(user);
        return vaultRepository.save(item);
    }

    // (Keep your delete method as it is, or we can secure it later!)
    public void deleteVaultItem(Long id) {
        vaultRepository.deleteById(id);
    }
}