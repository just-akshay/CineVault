package com.cinevault.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore // This stops Spring from looping infinitely when sending data to Angular
    private User user;

    // DON'T FORGET THE GETTER AND SETTER!
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}