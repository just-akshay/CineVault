package com.cinevault.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "vault_items")
@Data // This is the Lombok magic placeholder!
public class VaultItem {

    @Id // Declares this variable as the primary key row in SQL
    private Long id;
    
    private String title;
    private String posterPath;
    private Double voteAverage;
    private String releaseDate;
    private String mediaType;
}