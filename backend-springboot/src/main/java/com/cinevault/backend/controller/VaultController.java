package com.cinevault.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping; // <-- IMPORT THIS
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinevault.backend.model.VaultItem;
import com.cinevault.backend.service.VaultItemService;

@RestController
@RequestMapping("/api/vault")
@CrossOrigin(origins = "http://localhost:4200")
public class VaultController {

    @Autowired
    private VaultItemService vaultItemService;

    @GetMapping
    public List<VaultItem> getVault(Principal principal) {
        // principal.getName() magically pulls the username straight out of the JWT!
        return vaultItemService.getVaultItems(principal.getName());
    }

    @PostMapping
    public VaultItem addToVault(@RequestBody VaultItem item, Principal principal) {
        return vaultItemService.addVaultItem(item, principal.getName());
    }

    @DeleteMapping("/{id}")
    public void removeFromVault(@PathVariable Long id) {
        vaultItemService.deleteVaultItem(id);
    }
}