package org.example.labkoto.api.model;

import jakarta.persistence.*;

@Entity
@Table (name = "users")
public class User {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column (nullable = false, unique = true)
    private String username;

    @Column (nullable = false, unique = true)
    private String email;

    @Column (nullable = false)
    private String password;

    @Column (nullable = false)
    private Integer perm;

    @Column (nullable = false)
    private String accountType;

    public String getAccountType() {
        if ("admin".equalsIgnoreCase(accountType)) {
            return "admin";
        } else if ("professor".equalsIgnoreCase(accountType)) {
            return "professor";
        } else {
            return "student";
        }
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
        this.perm = "admin".equalsIgnoreCase(accountType) ? 1 : 0;
    }


    public User() {
    }

    public User(Integer id, Integer perm, String username, String email, String password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.perm = perm;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPerm() {
        return perm;
    }

    public void setPerm(Integer perm) {
        this.perm = perm;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}

