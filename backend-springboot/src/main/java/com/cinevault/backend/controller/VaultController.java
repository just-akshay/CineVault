package com.cinevault.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinevault.backend.model.VaultItem;
import com.cinevault.backend.service.VaultItemService;

@RestController // Tells Spring Boot that this class is an open network gateway
@RequestMapping("/api/vault") // Anchors the base URL pathway for this entire controller
@CrossOrigin(origins = "http://localhost:4200") // Crucial: Allows your Angular app on port 4200 to securely talk to Java!
public class VaultController {

    private final VaultItemService service;

    // Inject our business logic service layer
    public VaultController(VaultItemService service) {
        this.service = service;
    }

    // 1. GET: http://localhost:8080/api/vault
    @GetMapping
    public List<VaultItem> getVault() {
        return service.getAllVaultItems();
    }

    // 2. POST: http://localhost:8080/api/vault
    @PostMapping
    public VaultItem addToVault(@RequestBody VaultItem item) {
        return service.saveToVault(item);
    }

    // 3. DELETE: http://localhost:8080/api/vault/12345
    @DeleteMapping("/{id}")
    public void deleteFromVault(@PathVariable Long id) {
        service.removeFromVault(id);
    }
}